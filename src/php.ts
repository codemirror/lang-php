import {parser} from "@lezer/php"
import {parseMixed} from "@lezer/common"
import {html} from "@codemirror/lang-html"
import {indentNodeProp, continuedIndent, delimitedIndent, foldNodeProp, foldInside,
        Language, LRLanguage, LanguageSupport} from "@codemirror/language"
import {styleTags, tags as t} from "@codemirror/highlight"

/// A language provider based on the [Lezer PHP
/// parser](https://github.com/lezer-parser/php), extended with
/// highlighting and indentation information.
export const phpLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        IfStatement: continuedIndent({except: /^\s*({|else\b|elseif\b|endif\b)/}),
        TryStatement: continuedIndent({except: /^\s*({|catch\b|finally\b)/}),
        SwitchBody: context => {
          let after = context.textAfter, closed = /^\s*\}/.test(after), isCase = /^\s*(case|default)\b/.test(after)
          return context.baseIndent + (closed ? 0 : isCase ? 1 : 2) * context.unit
        },
        ColonBlock: cx => cx.baseIndent + cx.unit,
        "Block EnumBody DeclarationList": delimitedIndent({closing: "}"}),
        ArrowFunction: cx => cx.baseIndent + cx.unit,
        "String BlockComment": () => -1,
        Statement: continuedIndent({except: /^({|end(for|foreach|switch|while)\b)/})
      }),
      foldNodeProp.add({
        "Block EnumBody DeclarationList SwitchBody ArrayExpression ValueList": foldInside,
        ColonBlock(tree) { return {from: tree.from + 1, to: tree.to} },
        BlockComment(tree) { return {from: tree.from + 2, to: tree.to - 2} }
      }),
      styleTags({
        "Visibility abstract final static": t.modifier,
        "for foreach while do if else elseif switch try catch finally return throw break continue default case": t.controlKeyword,
        "endif endfor endforeach endswitch endwhile goto match": t.controlKeyword,
        "and or xor yield unset clone instanceof insteadof": t.operatorKeyword,
        "function fn class trait implements extends const enum global namespace trait use var": t.definitionKeyword,
        "include include_once require require_once declare enddeclare": t.definitionKeyword,
        "new from echo print array list as": t.keyword,
        null: t.null,
        Boolean: t.bool,
        VariableName: t.variableName,
        "NamespaceName/...": t.namespace,
        "NamedType/...": t.typeName,
        Name: t.name,
        "CallExpression/Name": t.function(t.variableName),
        "LabelStatement/Name": t.labelName,
        "MemberExpression/Name MemberExpression/VariableName": t.propertyName,
        "ScopedExpression/ClassMemberName/Name ScopedExpression/ClassMemberName/VariableName": t.propertyName,
        "CallExpression/MemberExpression/Name": t.function(t.propertyName),
        "CallExpression/ScopedExpression/ClassMemberName/Name": t.function(t.propertyName),
        "MethodDeclaration/Name": t.function(t.definition(t.variableName)),
        "FunctionDefinition/Name": t.function(t.definition(t.variableName)),
        "ClassDeclaration/Name": t.definition(t.className),
        UpdateOp: t.updateOperator,
        ArithOp: t.arithmeticOperator,
        LogicOp: t.logicOperator,
        BitOp: t.bitwiseOperator,
        CompareOp: t.compareOperator,
        ControlOp: t.controlOperator,
        AssignOp: t.definitionOperator,
        "$ ConcatOp": t.operator,
        LineComment: t.lineComment,
        BlockComment: t.blockComment,
        Integer: t.integer,
        Float: t.float,
        String: t.string,
        ShellExpression: t.special(t.string),
        "=> ->": t.punctuation,
        "( )": t.paren,
        "#[ [ ]": t.squareBracket,
        "${ { }": t.brace,
        "-> ?->": t.derefOperator,
        ", ; :: : \\": t.separator,
        "PhpOpen PhpClose": t.processingInstruction,
      })
    ]
  }),
  languageData: {
    commentTokens: {block: {open: "/*", close: "*/"}, line: "//"},
    indentOnInput: /^\s*(?:case |default:|end(?:if|for(?:each)?|switch|while)|else(?:if)?|\{|\})$/,
    wordChars: "$"
  }
})

/// PHP language support.
export function php(config: {
  /// By default, the parser will treat content outside of `<?` and
  /// `?>` markers as HTML. You can pass a different language here to
  /// change that. Explicitly passing disables parsing of such content.
  baseLanguage?: Language | null,
  /// By default, PHP parsing only starts at the first `<?` marker.
  /// When you set this to true, it starts immediately at the start of
  /// the document.
  plain?: boolean,
} = {}) {
  let support = [], base: Language | undefined
  if (config.baseLanguage === null) {
  } else if (config.baseLanguage) {
    base = config.baseLanguage
  } else {
    let htmlSupport = html({matchClosingTags: false})
    support.push(htmlSupport.support)
    base = htmlSupport.language
  }
  return new LanguageSupport(phpLanguage.configure({
    wrap: base && parseMixed(node => {
      if (!node.type.isTop) return null
      return {
        parser: base!.parser,
        overlay: node => node.name == "Text"
      }
    }),
    top: config.plain ? "Program" : "Template"
  }), support)
}

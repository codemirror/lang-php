import {parser} from "@lezer/php"
import {parseMixed} from "@lezer/common"
import {html} from "@codemirror/lang-html"
import {indentNodeProp, continuedIndent, delimitedIndent, foldNodeProp, foldInside,
        Language, LRLanguage, LanguageSupport} from "@codemirror/language"

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
        "String BlockComment": () => null,
        Statement: continuedIndent({except: /^({|end(for|foreach|switch|while)\b)/})
      }),
      foldNodeProp.add({
        "Block EnumBody DeclarationList SwitchBody ArrayExpression ValueList": foldInside,
        ColonBlock(tree) { return {from: tree.from + 1, to: tree.to} },
        BlockComment(tree) { return {from: tree.from + 2, to: tree.to - 2} }
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

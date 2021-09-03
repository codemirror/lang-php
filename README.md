<!-- NOTE: README.md is generated from src/README.md -->

# @codemirror/lang-php [![NPM version](https://img.shields.io/npm/v/@codemirror/lang-php.svg)](https://www.npmjs.org/package/@codemirror/lang-php)

[ [**WEBSITE**](https://codemirror.net/6/) | [**ISSUES**](https://github.com/codemirror/codemirror.next/issues) | [**FORUM**](https://discuss.codemirror.net/c/next/) | [**CHANGELOG**](https://github.com/codemirror/lang-php/blob/main/CHANGELOG.md) ]

This package implements PHP language support for the
[CodeMirror](https://codemirror.net/6/) code editor.

The [project page](https://codemirror.net/6/) has more information, a
number of [examples](https://codemirror.net/6/examples/) and the
[documentation](https://codemirror.net/6/docs/).

This code is released under an
[MIT license](https://github.com/codemirror/lang-php/tree/main/LICENSE).

We aim to be an inclusive, welcoming community. To make that explicit,
we have a [code of
conduct](http://contributor-covenant.org/version/1/1/0/) that applies
to communication around the project.

## API Reference

<dl>
<dt id="user-content-php">
  <code><strong><a href="#user-content-php">php</a></strong>(<a id="user-content-php^config" href="#user-content-php^config">config</a>&#8288;?: <a href="#user-content-phpconfig">PHPConfig</a> = {}) → <a href="https://codemirror.net/6/docs/ref#language.LanguageSupport">LanguageSupport</a></code></dt>

<dd><p>PHP language support.</p>
</dd>
<dt id="user-content-phpconfig">
  <h4>
    <code>interface</code>
    <a href="#user-content-phpconfig">PHPConfig</a></h4>
</dt>

<dd><p>Options to the <a href="#user-content-php"><code>php</code></a> function.</p>
<dl><dt id="user-content-phpconfig.baselanguage">
  <code><strong><a href="#user-content-phpconfig.baselanguage">baseLanguage</a></strong>&#8288;?: <a href="https://codemirror.net/6/docs/ref#language.Language">Language</a></code></dt>

<dd></dd><dt id="user-content-phpconfig.plain">
  <code><strong><a href="#user-content-phpconfig.plain">plain</a></strong>&#8288;?: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean">boolean</a></code></dt>

<dd></dd></dl>

</dd>
<dt id="user-content-phplanguage">
  <code><strong><a href="#user-content-phplanguage">phpLanguage</a></strong>: <a href="https://codemirror.net/6/docs/ref#language.LRLanguage">LRLanguage</a></code></dt>

<dd><p>A language provider based on the <a href="https://github.com/lezer-parser/php">Lezer PHP
parser</a>, extended with
highlighting and indentation information.</p>
</dd>
</dl>

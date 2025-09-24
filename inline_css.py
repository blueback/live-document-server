# Modeline {
#	 vi: foldmethod=marker foldlevel=0 filetype=python
# }

import css_inline
import sys

def createHTMLWithInlineCSS(input_file: str, output_file: str):
    with open(input_file, "r") as f:
        non_inlined_html = f.read()
        inlined_html = css_inline.inline(non_inlined_html)
        with open(output_file, "w") as f:
            f.write(inlined_html)
        print(f"Writing html with inlined css to output file:{output_file}")


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage ./inline_css.py <input_html> <output_html>")
        exit(1)
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    createHTMLWithINlineCSS(input_file, output_file)

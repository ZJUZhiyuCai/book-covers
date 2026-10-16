# Book Covers v1.3.0

Install the skill by giving its GitHub directory URL to your agent. The gallery now has a copyable installation prompt, a native Codex route and an optional Skills CLI route for other hosts. No manual archive extraction or system-font installation is needed.

Chinese main titles now use equal character size and weight across lines. This corrects the unequal phrase sizing in Ordinary World, The Count of Monte Cristo and How the Steel Was Tempered. The renderer fits Chinese title lines as one group, and rejects conflicting sizes. The selected illustrations are unchanged.

The standalone skill can also generate the exact title and author inside the image when font files or layout tools are inconvenient. A complete Ordinary World example, its prompt and provenance demonstrate this route. Generated lettering is checked visually and is not claimed to be a particular font or an editable text layer. The reference gallery continues to use bundled font files directly for predictable revisions.

- [Install with your agent](https://github.com/ZJUZhiyuCai/book-covers/blob/main/INSTALL.md)
- [Gallery](https://zjuzhiyucai.github.io/book-covers/)
- [Generated-lettering example](https://zjuzhiyucai.github.io/book-covers/process/generated-lettering/ordinary-world-zh.png)

Validation: twelve automated tests pass, including Chinese group fitting, unequal-size rejection, title/author fidelity and unchanged illustration pixels. Ten studies build into twenty covers and twenty-three HTML pages. Release archives remain available for archiving and artwork export; they are not the primary skill-installation flow.

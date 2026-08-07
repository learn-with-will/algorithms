// Prism core + the languages the Algorithms lessons use — Python for every
// implementation, plus JSON and shell for the occasional config/command. Plain
// pseudocode blocks use the `text` fence, which Prism leaves unhighlighted.
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

export default Prism;

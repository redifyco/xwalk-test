import {isEditorMode} from "../../scripts/utils.js";

export default async function decorate(block) {
  console.log('block', block)
  const inEditorMode = isEditorMode();


  block.appendChild(block)
}

export const isEditorMode = () => {
  // Verifica sessionStorage per chiavi che iniziano con "aue"
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith('aue')) {
      return true;
    }
  }
  return false;
};



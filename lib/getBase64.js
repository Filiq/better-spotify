export default function getBase64(file) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    reader.readAsDataURL(file);

    reader.onload = () => {
      resolve(reader.result);
    };
  });
}

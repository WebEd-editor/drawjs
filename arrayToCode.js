/*let actions = [
    {
       el: "menu",
       ev: "click",
       fun: "alert('hello');",
       iife: "iife function",
       prompt: "let p1",
       prompt: "let p2",
    }
];
*/
function generateCodeFromTopToBottom(actions) {
  let result = "";

  actions.forEach(obj => {
    let lines = [];
    let indent = "    ";
/*
    Object.keys(obj).forEach(key => { if(key.startsWith("prompt")) {lines.push(`${obj[key]}`);}});
    Object.keys(obj).forEach(key => { if(key.startsWith("console")) {lines.push(`${obj[key]}`);}});
    Object.keys(obj).forEach(key => { if(key.startsWith("alert")) {lines.push(`alert(${obj[key]});`);}});
*/
    const keys = Object.keys(obj).filter(k => k !== "el" && k !== "ev" && k !== "elseIf");

    keys.forEach(key => {
      const val = obj[key];
      if (/^for/.test(key)) {
        lines.push(`${indent}for (${val}) {`);
        indent += "  ";
      } else if (/^if/.test(key)) {
        lines.push(`${indent}if (${val}) {`);
        indent += "  ";
      } else if (/^fun/.test(key)) {
        lines.push(`${indent}${val}`);
      } else if (/^alert/.test(key)) {
        lines.push(`${indent}alert(${val});`);
      } else if (/^console/.test(key)) {
        lines.push(`${indent}${val}`);
      } else if (/^prompt/.test(key)) {
        lines.push(`${indent}${val}`);
      } else if (/^selector/.test(key)) {
        lines.push(`${indent}${val}`);
      } else if (key === "else") {
        indent = indent.slice(0, -2);
        lines.push(`${indent}} else {`);
        indent += "  ";
      }
    });

    // handle else-if
    if (obj.elseIf && Array.isArray(obj.elseIf)) {
      indent = indent.slice(0, -2);
      obj.elseIf.forEach(e => {
        lines.push(`${indent}} else if (${e.cond}) {`);
        lines.push(`${indent}  ${e.fun}`);
      });
      lines.push(`${indent}}`);
    }

    // close all open blocks
    while (indent.length > 4) {
      indent = indent.slice(0, -2);
      lines.push(`${indent}}`);
    }

    if(obj.iife && Array.isArray(obj.iife) !== null) {
       result += `
(()=> {
${lines.join("\n")}
})();
       `;
    }else if(obj.el && Array.isArray(obj.el) !== null) {
       result += `
document.querySelector(".${obj.el}").addEventListener("${obj.ev}", () => {
${lines.join("\n")}
});
       `;
    }

    /*result += `
      document.querySelector(".${obj.el}").addEventListener("${obj.ev}", () => {
         ${lines.join("\n")}
      });
    `;*/
  });
  
  document.getElementById("arrayCode").value = result;
  return result;
}
/*
console.log(generateCodeFromTopToBottom(actions));
*/

(function(root){
const alphabet=['1','12','14','145','15','124','1245','125','24','245','13','123','134','1345','135','1234','12345','1235','234','2345','136','1236','2456','1346','13456','1356'];
const cell=d=>String.fromCodePoint(0x2800+[...d].reduce((n,d)=>n|(1<<(Number(d)-1)),0));
const letters=Object.fromEntries(alphabet.map((v,i)=>[String.fromCharCode(97+i),cell(v)]));
const punct={',':cell('2'),';':cell('23'),':':cell('25'),'.':cell('256'),'!':cell('235'),'?':cell('236'),"'":cell('3'),'-':cell('36'),'(':cell('5')+cell('126'),')':cell('5')+cell('345'),'"':null};
function translate(input){let out='',numeric=false,quote=false;const unsupported=new Set();const s=Array.from(input.replace(/\r\n?/g,'\n').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/\t/g,'    ').replace(/\u00a0/g,' ').replace(/[\u2028\u2029]/g,'\n'));for(let i=0;i<s.length;i++){const c=s[i];if(/[0-9]/.test(c)){if(!numeric)out+=cell('3456');out+=letters['jabcdefghi'[Number(c)]];numeric=true;continue;}if(/[a-z]/i.test(c)){if(numeric&&/[a-j]/.test(c))out+=cell('56');if(/[A-Z]/.test(c))out+=cell('6');out+=letters[c.toLowerCase()];numeric=false;continue;}if(c===' '||c==='\n'){out+=c;numeric=false;continue;}if(c==='"'){out+=cell(quote?'356':'236');quote=!quote;numeric=false;continue;}if(c in punct){out+=punct[c];if(!(/[.,]/.test(c)&&numeric&&/[0-9]/.test(s[i+1]||'')))numeric=false;continue;}unsupported.add(c);out+='□';numeric=false;}return {text:out,unsupported:[...unsupported]};}
function wrap(text,width=28){
 if(!Number.isInteger(width)||width<2)throw new Error('Invalid line width');
 return text.split('\n').flatMap(line=>{
  const rows=[];
  while(line.length>width){
   let cut=line.lastIndexOf(' ',width);
   // Keep short words intact. Preserve explicit indentation and repeated spaces.
   if(cut>0 && /[^ ]/.test(line.slice(0,cut))){rows.push(line.slice(0,cut));line=line.slice(cut+1);}
   else {cut=width;const last=line[cut-1];if(last===cell('6')||last===cell('3456')||last===cell('56'))cut--;rows.push(line.slice(0,cut));line=line.slice(cut);}
  }
  rows.push(line);return rows;
 });
}
function paginate(text,width=28,linesPerPage=23){
 if(!Number.isInteger(linesPerPage)||linesPerPage<1)throw new Error('Invalid page height');
 const rows=wrap(text,width),pages=[];
 for(let i=0;i<rows.length;i+=linesPerPage)pages.push(rows.slice(i,i+linesPerPage));
 return pages;
}
root.Braille={translate,wrap,paginate,cell};if(typeof module!=='undefined')module.exports=root.Braille;
})(typeof window!=='undefined'?window:globalThis);

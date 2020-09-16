const pdfExport = require('./pdfexport');
const fs = require("fs");

(async () => {

    let pagetext;
    let filename;
    if(process.argv.length<3) {
        console.error("usage node "+process.argv[1]+" filename.pdf");
        process.exit(-1);
    } else {
        filename=process.argv[2];
    }
    
    try {
        if (fs.existsSync(filename)) {
        //file exists
        }
    } catch(err) {
        console.error("Cannot open "+filename);
        process.exit(-1);
    }
    
    await pdfExport.GetTextFromPDF(filename).then(data => pagetext=data);

    //console.log(pagetext);

    pagetext=pagetext.replace(/\s+/g, ' '); // replace multiple consecutive spaces with one

    var end=pagetext.length;
    var lcpagetext=pagetext.toLowerCase();
    
    var init=lcpagetext.indexOf("abstract");
    
    //console.log("found abstract at ",init);

    if(init==-1)  { console.log("No abstract found. Sorry. (1)"); process.exit(-1); }
    
    init+=8; // abstract has 8 letters
    lcpagetext=lcpagetext.slice(init);
    
    //console.log("remaining ",lcpagetext);
    let match=/[a-z]/.exec(lcpagetext);
    if(!match) { console.log("No abstract found. Sorry. (2)",lcpagetext); process.exit(-1); }
    init+=match.index;
    lcpagetext=lcpagetext.slice(match.index);
    
    var tmpend=0;
    ["keyword", "key word", "key-word", "index term", "nomenclature", "i. introduction", "1. introduction", "ii. introduction", "i.. introduction"].forEach((word) => {
        tmpend=lcpagetext.indexOf(word);
        if(tmpend!=-1) {
            //console.log("found %s at %d",word,tmpend);
            if (tmpend < end ) {
                end=tmpend;
            }
        }
    }); 
        
    //console.log("abstract ends at ",end);
    
    var abstract=pagetext.slice(init,end+init);
    
    console.log(abstract);
    //console.log("length is ",abstract.length);
    
})();

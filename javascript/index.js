// const liSelectByBarcode = document.getElementById("barcode");
const ulBuyerSelector = document.getElementById("buyer-selection");
ulBuyerSelector.addEventListener('click', processSelection);
const divDisplaySelection = document.getElementById("option-selected");

function processSelection(e){
    if (e.target.id==="barcode"){
        barcodeInputForm();
        divDisplaySelection.style.display = "block";
    }else if (e.target.id==="name"){
        nameInputForm();
        divDisplaySelection.style.display = "block";
    }else if (e.target.id==="vendor"){
        fetchVendors();
        divDisplaySelection.style.display = "block";
    }else if (e.target.id==="cat"){
        categorySelectBox();
        divDisplaySelection.style.display = "block";
    }
}


function barcodeInputForm(){
    const bar="<form><lable for>Enter Barcode:</label><input type='text'></input>"+
    "<button>Go</button></form>"
    divDisplaySelection.innerHTML="";
    divDisplaySelection.innerHTML=bar;
}

function nameInputForm(){
    const nameForm="<form><lable for>Enter Product Name:</label><input type='text'></input>"+
    "<button>Go</button></form>"
    divDisplaySelection.innerHTML="";
    divDisplaySelection.innerHTML=nameForm;
}

function fetchVendors(){
    fetch('http://localhost:3000/api/v1/vendors')
        .then(res => res.json())
        .then(vendors => createVendorSelectBox(vendors));
 
}

function categorySelectBox(){
    const categoryForm="<form><lable for>Enter Product Name:</label><input type='text'></input>"+
    "<button>Go</button></form>"
    divDisplaySelection.innerHTML="";
    divDisplaySelection.innerHTML=bar;
}


function createVendorSelectBox(vendors){
    const vendorSelBox=document.createElement('select');
    // console.log(vendors);
    for(let vendor of vendors){
        const option=document.createElement('option');
        option.value = vendor.name;
        option.innerText = vendor.name;
        vendorSelBox.append(option);
    }
    divDisplaySelection.innerHTML="";
    divDisplaySelection.append(vendorSelBox);
}
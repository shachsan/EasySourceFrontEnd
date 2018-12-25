const buyerPage = document.getElementById('wrapper');
buyerPage.style.display='none';
const divMain=document.getElementById('main');
const divVendorInfo = document.getElementById('vendor-info');
const divProductDetail=document.getElementById('all-product');
const tableProduct=document.getElementById('product-table');
console.log(tableProduct);
tableProduct.addEventListener('dblclick', tableAction)

let id=6;
fetchVendorItems(id);

function fetchVendorItems(id){
    fetch(`http://localhost:3000/api/v1/vendors/${id}`)
        .then(res=>res.json())
        .then(vendorDetails=>showAllVendorItems(vendorDetails))
}


function showAllVendorItems(vendorDetails){
    divVendorInfo.innerHTML=`<p>Name: ${vendorDetails.name}</p>`+
                            `<p>Username: ${vendorDetails.username}`+
                            `<p>Email: ${vendorDetails.email}`+
                            `<p>Minimum set? : ${vendorDetails.has_min}`+
                            `<p>Minimum Amount: ${vendorDetails.min_amount}`
    for(let product of vendorDetails.products){
        let row = tableProduct.insertRow();
        let cellImage = row.insertCell();
        let cellName = row.insertCell();
        // cellName.setAttribute('name', product.name)
        let cellSize = row.insertCell();
        let cellBarcode = row.insertCell();
        let cellBrand = row.insertCell();
        let cellCategory = row.insertCell();
        let cellAction=row.insertCell();
        
        cellImage.innerHTML = `<img src=${product.img_url} class="table-img">`
        cellName.innerText = product.name;
        cellSize.innerText = product.size;
        cellBarcode.innerText = product.barcode;
        cellBrand.innerText = product.brand;
        cellCategory.innerText = product.category_type;

        let editButton=document.createElement('button');
        editButton.setAttribute('class', 'item-action')
        editButton.innerText="Edit";
        // editButton.addEventListener('click', editItem);

        let deleteBtn=document.createElement('button');
        deleteBtn.setAttribute('class', 'item-action')
        deleteBtn.innerText="Delete";
        // deleteBtn.addEventListener('click', deleteItem);

        cellAction.append(editButton);
        cellAction.append(deleteBtn);


        
        // for(let extraInfo of vendorDetails.vendor_products){
        //     let cellVitem = row.insertCell();
        //     cellVitem.innerText = extraInfo.v_item;

        //     let cellPrice = row.insertCell();
        //     cellPrice.innerText = extraInfo.case_price;
        // }

      }
    
}

function tableAction(e){
    let targetEle=e.target;
    let editCell=document.createElement('input');
    editCell.value=e.target.innerText;
    editCell.setAttribute('type', 'text');
    editCell.setAttribute('onfocus','this.select()')
    editCell.autofocus='true';

    targetEle.innerText="";
    targetEle.append(editCell);

    editCell.addEventListener('keydown', (e)=>{
        if (e.key==='Enter'){
            targetEle.innerText=editCell.value;
            editCell.remove();

            fetch(`http://localhost:3000/`)
        }
    })

    if(e.target.innerText==='Edit'){
        console.log(e.target.parentNode.parentNode);
    }
}
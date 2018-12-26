const buyerPage = document.getElementById('wrapper');
buyerPage.style.display='none';
const divMain=document.getElementById('main');
const divVendorInfo = document.getElementById('vendor-info');
const divProductDetail=document.getElementById('all-product');
const tableProduct=document.getElementById('product-table');
const buttonAddNewBtn=document.getElementById('add-product');
// let row;
// console.log(tableProduct);
tableProduct.addEventListener('dblclick', tableAction);
tableProduct.addEventListener('click', tableActionOnSingleClick);
buttonAddNewBtn.addEventListener('click', addNewItem);

//Base URL for api
const baseUrl=`http://localhost:3000/api/v1/`;

let vendorId=1;//hardcoded id for testing, set this id to vendor id once vendor logs in

fetchVendorItems(vendorId);

function fetchVendorItems(id){
    fetch(`http://localhost:3000/api/v1/vendors/${vendorId}`)
        .then(res=>res.json())
        .then(vendorDetails=>showAllVendorItems(vendorDetails))
}


function showAllVendorItems(vendorDetails){
    divVendorInfo.innerHTML=`<p>Name: ${vendorDetails.name}</p>`+
                            `<p>Username: ${vendorDetails.username}`+
                            `<p>Email: ${vendorDetails.email}`+
                            `<p>Minimum set? : ${vendorDetails.has_min}`+
                            `<p>Minimum Amount: ${vendorDetails.min_amount}`


    //test code begin 'test1'
        for(let product of vendorDetails.products){
            
        let id = product.product_id
        fetch(`http://localhost:3000/api/v1/products/${id}`)
            .then(res=>res.json())
            .then(productInfo=>populateTable(productInfo, product))
        }

        
        
    //test code end


        //working code begin
    // for(let product of vendorDetails.products){
    //     let row = tableProduct.insertRow();
    //     let cellImage = row.insertCell();
    //     let cellName = row.insertCell();
    //     // cellName.setAttribute('name', product.name)
    //     let cellSize = row.insertCell();
    //     let cellBarcode = row.insertCell();
    //     let cellBrand = row.insertCell();
    //     let cellCategory = row.insertCell();
    //     let cellAction=row.insertCell();
        
    //     cellImage.innerHTML = `<img src=${product.img_url} class="table-img">`
    //     cellName.innerText = product.name;
    //     cellSize.innerText = product.size;
    //     cellBarcode.innerText = product.barcode;
    //     cellBrand.innerText = product.brand;
    //     cellCategory.innerText = product.category_type;

    //     let editButton=document.createElement('button');
    //     editButton.setAttribute('class', 'item-action')
    //     editButton.innerText="Edit";
    //     // editButton.addEventListener('click', editItem);

    //     let deleteBtn=document.createElement('button');
    //     deleteBtn.setAttribute('class', 'item-action')
    //     deleteBtn.innerText="Delete";
    //     // deleteBtn.addEventListener('click', deleteItem);

    //     cellAction.append(editButton);
    //     cellAction.append(deleteBtn);
    //working code end


        
        // for(let extraInfo of vendorDetails.vendor_products){
        //     let cellVitem = row.insertCell();
        //     cellVitem.innerText = extraInfo.v_item;

        //     let cellPrice = row.insertCell();
        //     cellPrice.innerText = extraInfo.case_price;
        // }

    //   }
    
}

//test code function called by test1
    function populateTable(data, product){
        // console.log(data);
        // for(let key in data){
        let row = tableProduct.insertRow();
        row.setAttribute('id',product.product_id);
        row.setAttribute('data-vpid', product.id);

        let cellImage = row.insertCell();

        let cellName = row.insertCell();
        cellName.setAttribute('name', 'name')

        let cellSize = row.insertCell();
        cellSize.setAttribute('name', 'size')

        let cellBarcode = row.insertCell();
        cellBarcode.setAttribute('name', 'barcode')

        let cellBrand = row.insertCell();
        cellBrand.setAttribute('name', 'brand')

        let cellCategory = row.insertCell();
        cellCategory.setAttribute('name', 'category_type')
        
        cellImage.innerHTML = `<img src=${data.img_url} class="table-img">`
        cellName.innerText = data.name;
        cellSize.innerText = data.size;
        cellBarcode.innerText = data.barcode;
        cellBrand.innerText = data.brand;
        cellCategory.innerText = data.category_type;

        let cellVitem=row.insertCell();
        cellVitem.setAttribute('name', 'v_item')
        cellVitem.innerText=product.v_item;

        let cellPrice=row.insertCell();
        cellPrice.setAttribute('name', 'case_price')
        cellPrice.innerText=product.case_price;
        
        let cellAction=row.insertCell();
        
        let editButton=document.createElement('button');
        editButton.setAttribute('class', 'item-action')
        editButton.innerText="Edit";
        // editButton.addEventListener('click', editItem);

        //Create Update to toggle with Edit button and set to display none once created
        //make it visible once Edit button is click
        let updateButton=document.createElement('button');
        updateButton.setAttribute('class', 'item-action');
        updateButton.setAttribute('name', 'updateAll');
        updateButton.innerText="Update";
        updateButton.style.display='none';

        //Since the update button works differently, needed 2 update buttons
        let updtBtnPriceNitem=createTag('button');
        updtBtnPriceNitem.setAttribute('class', 'item-action');
        updtBtnPriceNitem.setAttribute('name', 'updatePnI');
        updtBtnPriceNitem.innerText="Update";
        updtBtnPriceNitem.style.display='none';

        let deleteBtn=document.createElement('button');
        deleteBtn.setAttribute('class', 'item-action')
        deleteBtn.innerText="Delete";
        // deleteBtn.addEventListener('click', deleteItem);

        cellAction.append(editButton);
        cellAction.append(updateButton);
        cellAction.append(updtBtnPriceNitem);
        cellAction.append(deleteBtn);

        
        
    // }
}

//test code function test1 end





function tableAction(eventDblClk){
    console.log(eventDblClk.target);
    let targetEle=eventDblClk.target;
    let editCell=document.createElement('input');
    editCell.value=eventDblClk.target.innerText;
    editCell.setAttribute('type', 'text');
    editCell.setAttribute('onfocus','this.select()')
    editCell.autofocus='true';

    targetEle.innerText="";
    targetEle.append(editCell);

    editCell.addEventListener('keydown', (eventKd)=>{
        if (eventKd.key==='Enter'){
            targetEle.innerText=editCell.value;
            editCell.remove();

            fetch(`http://localhost:3000/`)
        }
    })

 
}

function tableActionOnSingleClick(eventSingleClk){
    console.log(eventSingleClk.target.name);
    if(eventSingleClk.target.name==='barcode'){
        // console.log("barcode filled is click");
        eventSingleClk.target.addEventListener('keyup', lookupProductForBarcode)
        // lookupProductForBarcode(eventSingleClk);
    }

    if(eventSingleClk.target.name==='updatePnI'){
        // console.log("Update button P&I click");
        updatePriceAndItemNum(eventSingleClk);

    }

    if(eventSingleClk.target.innerText==='Edit'){
        
        let id=eventSingleClk.target.parentNode.parentNode.id;
        fetch(`http://localhost:3000/api/v1/products/${id}`)
            .then(res=>res.json())
            .then(prod=> editableItem(prod.vendor_products.length))    
    }

    function editableItem(vCount){
        if (vCount>1){
            highlightItemNumAndPrice(eventSingleClk);
        }else{
            highlightEditableCells(eventSingleClk);
        }
    }

}

function highlightEditableCells(e){
    // console.log(e.bubbles);
    let currentTr=e.target.parentNode.parentNode;
    let currentTrChilds=currentTr.childNodes;

    // console.log(currentTrChilds);
    currentTrChilds.forEach((td,i) => {
        // console.log(i);
        if(i!==8 && i!==0){
           let editCell=document.createElement('input');
            editCell.value=td.innerText
            editCell.setAttribute('type', 'text');
            editCell.setAttribute('onfocus','this.select()')
            editCell.autofocus='true';

            td.innerText="";
            td.append(editCell);
        }
    });

    e.target.style.display='none';//hide the edit button and display update button
    e.target.nextElementSibling.style.display="inline"; //display update button

    e.target.nextElementSibling.addEventListener('click', updateData);

    // Action when vendor clicks on 'update' button
    // e is still is the event object passed when clicked on the table
    // console.log(e.target);
    function updateData(eve){
        // console.log(currentTrChilds);
        
        let currentRow=eve.target.parentNode.parentNode;
        let id=currentRow.id;
        // console.log(currentRow.data-vpid);
        let vpid=currentRow.dataset.vpid;
        console.log(vpid);
        currentRowChilds=currentRow.childNodes;

        let updateItems={};
        let vpUpdateObj={};
        // console.log(currentRowChilds);
        currentRowChilds.forEach((td,i) => {
            if(i!==8 && i!==0){
                td.innerText=td.firstChild.value;
                // console.log(td.getAttribute("name"));
                let key=td.getAttribute("name");
                if(key==='v_item' || key==='case_price'){
                    vpUpdateObj[key]=td.innerText;
                }else{

                    updateItems[key]=td.innerText;
                }
                // td.firstChild.remove();
            }
        })
        // console.log(updateItems);
        // console.log(vpUpdateObj);
        eve.target.style.display='none';//hide the update button
        eve.target.previousElementSibling.style.display='inline';//display edit button

        //fectch update--product
        fetch(`http://localhost:3000/api/v1/products/${id}`,{
            method: 'PATCH',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(updateItems)
        })

        //complete fetch update--product


        //fetch update ---vendor_products for price and v_item
        
        fetch(`http://localhost:3000/api/v1/vendor_products/${vpid}`,{
            method: 'PATCH',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(vpUpdateObj)
        })
        //end of vendor_products update

    }

}

function getProductAttrs(){
    let attrs=["img_url", "name", "size", "barcode", "brand", "category_type", "v_item", "case_price"];
    return attrs;
}


function addNewItem(){
    let row=tableProduct.insertRow();
    row.style.height="50px";
    
    getProductAttrs().forEach(function(attr, i){
        let cell=row.insertCell();

        if(i!==9){
            let input=document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('name',attr)
            cell.append(input);
        }
    })
}

function createTag(tagName){
    return document.createElement(tagName);
}

function getEditBox(){
    let inputPrice=createTag('input');
    // inputPrice.setAttribute('name','editPrice')
    inputPrice.style.width="60px";
    inputPrice.style.height="30px";
    
    return inputPrice;
}



function highlightItemNumAndPrice(e){
    alert("Other vendor also stock this product. So, full edit is not available. Editable cells will be highlighted.")
    let price=e.target.parentNode.previousElementSibling;
    // debugger;
    let editPrice=getEditBox();
    editPrice.setAttribute('name','editPrice')
    editPrice.value=price.innerText;
    // console.log(editPrice.value);
    price.innerText="";
    price.append(editPrice);

    let vItem=price.previousElementSibling;
    let inputItemNum=getEditBox();
    inputItemNum.setAttribute('name','editItem')
    inputItemNum.value=vItem.innerText;
    vItem.innerText="";
    vItem.append(inputItemNum);

    e.target.style.display='none';//hide the edit button and display update button
    e.target.nextElementSibling.nextElementSibling.style.display="inline"; //display update P&I button
    // console.log(e.target.nextElementSibling);
    // console.log(e.target);
    // debugger;
    // if(e.target.innerText==='Update'){
    //     updatePriceAndItemNum(e,price,editPrice, vItem, inputItemNum);
    // }

}

function updatePriceAndItemNum(e){
        let currentRow=e.target.parentNode.parentNode;
        let tdPrice=e.target.parentNode.previousElementSibling;
        let tdVitem=tdPrice.previousElementSibling;
        let newPrice=document.getElementsByName('editPrice')[0];
        let newItemNum=document.getElementsByName('editItem')[0];
        
        let vpid=currentRow.dataset.vpid;
        let vpUpdateObj={v_item:newItemNum.value, case_price:newPrice.value};
        tdPrice.innerText=newPrice.value;
        tdVitem.innerText=newItemNum.value;
        newPrice.remove();
        newItemNum.remove();
        
        e.target.style.display='none';//hide the update P&I button
        e.target.previousElementSibling.previousElementSibling.style.display='inline';//display edit button

        //fetch update ---vendor_products for price and v_item
        
        fetch(`http://localhost:3000/api/v1/vendor_products/${vpid}`,{
            method: 'PATCH',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(vpUpdateObj)
        })
        //end of vendor_products update

    

}

function lookupProductForBarcode(e){
    let userUpc=e.target.value;

    fetch(baseUrl+'products')
        .then(res=>res.json())
        .then(allProducts=>lookupItemByBarcode(allProducts))

    function lookupItemByBarcode(products){
        for(let product of products){
            let strBarcode=product.barcode.toString();
            // console.log(typeof(product.barcode));
            if(strBarcode.startsWith(userUpc)){
                console.log(product);
            }
        }
    }

}
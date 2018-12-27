const buyerPage = document.getElementById('wrapper');
buyerPage.style.display='none';
const divMain=document.getElementById('main');
const divVendorInfo = document.getElementById('vendor-info');
const divProductDetail=document.getElementById('all-product');
const tableProduct=document.getElementById('product-table');
const buttonAddNewBtn=document.getElementById('add-product');
const errorMsg=document.getElementsByClassName('error-msg')[0];
// let row;
// console.log(tableProduct);
tableProduct.addEventListener('dblclick', tableAction);
tableProduct.addEventListener('click', tableActionOnSingleClick);
buttonAddNewBtn.addEventListener('click', addNewItem);

//Base URL for api
const baseUrl=`http://localhost:3000/api/v1/`;

let vendorId=1;//hardcoded id for testing, set this id to vendor id once vendor logs in

fetchVendorItems(vendorId);
// fetchAllProducts();

function fetchVendorItems(id){
    fetch(`http://localhost:3000/api/v1/vendors/${vendorId}`)
        .then(res=>res.json())
        .then(vendorDetails=>showAllVendorItems(vendorDetails))
}


function showAllVendorItems(vendorDetails){
    divVendorInfo.innerHTML=`<div class="block" style="display:inline-block"><p>Name: ${vendorDetails.name}</p>`+
                            `<p>Username: ${vendorDetails.username}`+
                            `<p>Email: ${vendorDetails.email}`+
                            `<p>Minimum set? : ${vendorDetails.has_min}`+
                            `<p>Minimum Amount: ${vendorDetails.min_amount}`+
                            `</div>`


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
    //     cellCategory.innerText = product.category_id;

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
        cellCategory.setAttribute('name', 'category_id')
        
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
    if(eventSingleClk.target.className==='input-cell'){
        eventSingleClk.target.style.backgroundColor='transparent';
        errorMsg.style.display='none';
    }
    console.log(eventSingleClk.target.name);
    if(eventSingleClk.target.name==='barcode'){
        // console.log("barcode filled is click");
        eventSingleClk.target.addEventListener('keyup', lookupProductForBarcode)
        // lookupProductForBarcode(eventSingleClk);
    }

    //if add button inside new cell is click
    if(eventSingleClk.target.id==='add-item'){
        addNewProduct(eventSingleClk);
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

function getCurrentRowChilds(e){
    let currentTr=e.target.parentNode.parentNode;
    let currentTrChilds=currentTr.childNodes;
    return currentTrChilds;
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

function getProdNvenProdAttrs(){
    let attrs=["img_url", "name", "size", "barcode", "brand", "category_id", "v_item", "case_price"];
    return attrs;
}

function getProdOnlyAttrs(){
    let attrs=["img_url", "name", "size", "barcode", "brand", "case_pack", "category_id"];
    return attrs;
}


function addNewItem(){
    let row=tableProduct.insertRow();
    row.style.height="50px";
    
    getProdNvenProdAttrs().forEach(function(attr, i){
        let cell=row.insertCell();

        if(i!==9){
            let input=createTag('input');
            input.setAttribute('type', 'text');
            input.setAttribute('class','input-cell')
            input.setAttribute('name',attr)
            cell.append(input);
        }
    })

    let actionCell=row.insertCell();
    if (requiredFields()!==""){         //requiredFields functions not implemented yet
        let addBtn=createTag('button')
        addBtn.innerText='Add';
        addBtn.setAttribute('id','add-item')
        actionCell.append(addBtn);
    }
}


function requiredFields(){//need to implement this functionality, check if the fields are actually empty
    return false;
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

//separate function to get all products---begin

async function getAllProducts () {
    try {
      const resp = await fetch(baseUrl+'products')
    //   console.log(resp)
      return resp.json();
    } catch (err) {
         console.log(err)
      }
 }
// function fetchAllProducts(){
//       return  getAllProducts=(data)=>fetch(baseUrl+'products')
//         .then(res=>res.json())
//         .then(allProducts=>allProducts)

//         // return data;
// }

// function getAllProducts(allProducts){
//     console.log(allProducts);
//     return allProducts;
// }
//separate function to get all products---end


function lookupProductForBarcode(e){
    let userUpc=e.target.value;

    fetch(baseUrl+'products')
        .then(res=>res.json())
        .then(allProducts=>lookupItemByBarcode(allProducts))

    function lookupItemByBarcode(products){
        let itemSelectDiv=createTag('div');
        itemSelectDiv.setAttribute('id', 'item-found');
        itemSelectDiv.setAttribute('class', 'block');
        itemSelectDiv.style.display='inline-block';
        let ul=createTag('ul');
        
        
        for(let product of products){
            let strBarcode=product.barcode.toString();
            // console.log(typeof(product.barcode));
            if(strBarcode.startsWith(userUpc)){
                if(ul.lastChild){
                    ul.lastChild.remove();
                }
                let li=createTag('li');
                li.innerHTML=`<img width="30px" height="25px" src=${product.img_url}>Name:${product.name} Barcode:${product.barcode}`
                ul.append(li);
                console.log(product);
            }
        }
        itemSelectDiv.append(ul);
        divVendorInfo.append(itemSelectDiv);
    }

}

function requiredFields(){
    let attrs=["name", "size", "barcode", "case_price"];
    return attrs;
}



function addNewProduct(e){
    let rowCells=getCurrentRowChilds(e);
    let requiredCellsEmpty=false;
    let productExist=false;

    //check if the required fields are empty
    for(let cell of rowCells){
        if(requiredFields().includes(cell.firstChild.name) && cell.firstChild.value===''){
            cell.firstChild.style.backgroundColor="#ff8080";
            errorMsg.style.display='block';
            requiredCellsEmpty=true;
        }
    }

    if(!requiredCellsEmpty){
        //check if the product is existing product
        //if product already exists, fetch post to vendor_products table
        //if product is not existing product, fetch post both products and vendor_products tables
        getAllProducts().then((data)=>{
            let productObj={};
            let vpObj={};

            //collect user inputs from cells and build product and vp objects
            for(let cellData of rowCells){

                if(getProdOnlyAttrs().includes(cellData.firstChild.name)){
                    productObj[cellData.firstChild.name]=cellData.firstChild.value;
                }else{
                    vpObj[cellData.firstChild.name]=cellData.firstChild.value;
                }
            }
            
            //Once objects are build, check if the user entered product is a pre-existing product
            //if pre-exist, FETCH POST vp tables
            for(let product of data){
                if (product.barcode===productObj.barcode){
                    //prepare vpObj for post method
                    vpObj.product_id=product.id;
                    vpObj.vendor_id=vendorId;

                    //fetch post only to vendor_products table
                    fetch(`${baseUrl}vendor_products`, {
                        method: 'POST',
                        headers:{'Content-Type':'application/json'},
                        body:JSON.stringify(vpObj)
                    })

                    productExist=true;     
                    break;
                }

            
            }

            // Product does not exist - fetch post to both products and vp tables
            if(!productExist){

                console.log(productObj);
                //POST products table
                fetch(`${baseUrl}products`, {
                    method: 'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(productObj)
                }).then(function(res){
                    if(!res.ok){
                        throw Error(res.statusText);
                    }
                    console.log(res);
                }).catch(function(error){
                    alert('The following error has occurred: \n', error);
                })

     
                  
                // function postVp(justAddedProd){
                console.log(data.length);
                vpObj.product_id=data.length+1;
                vpObj.vendor_id=vendorId;
                console.log(vpObj);
                //POST vendor_products table
                fetch(`${baseUrl}vendor_products`, {
                    method: 'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(vpObj)
                })

            }
            
        })

    }
}
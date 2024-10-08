function strSort(arr){
    let data =  arr.filter(item=>{
        return  isNaN(parseFloat(item))&& (typeof item === 'string' )
    })
    data.sort().forEach(item=>{
        console.log(item,)
    })
}
strSort(['12','abg','abc','accc','abb'])
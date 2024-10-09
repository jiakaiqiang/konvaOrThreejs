//A左 D 右 w 上 s下

function  handleno(str){
    return  str.find(item=>item==='A') || str.find(item=>item==='D')|| str.find(item=>item==='S')||str.find(item=>item==='W')

}

function hanldemu(str){
    //判断是否存在多个英文字符


}
function  pointMove(str){
    let arr =  str.split(';')
    let x =0 //a d 控制
    let y = 0 // w s 控制
    const map = {
        A:'-',
        D:"+",
        W:"+",
        S:"-"
    }
    let data =  arr.filter(item=>{

           return hanldemu(item)&& handleno(item)

    })



}
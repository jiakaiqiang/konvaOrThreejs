let weight = [1,2, 3,4];//物体体积
let value = [2, 4, 4,5];//物体价值
let bagWeight = 5;//背包最大容纳量
function bagProblem(weight, value, bagWeight) {
    // 初始化dp,生成二维数组，长度为物体种类总长度，里面的数组长度为（背包最大容纳量+1）
    const dp = new Array(weight.length ).fill(0).map(() => new Array(bagWeight + 1).fill(0));


    //遍历背包容量
    for(let j = 1;j<=bagWeight;j++){
        //遍历物品数量
        for(let i =0;i<weight.length;i++){
            //如果容器的容量小于物品数量 则集成上一个物品的最优解
            if(i==0){
                dp[i][j] =  dp[0][j]
            }else{
                if(j<weight[i]){
                    dp[i][j] = dp[i-1][j]
                }else{
                    //如果能放下则分为 不放和放中取最大的解
                    dp[i][j] = Math.max(dp[i-1][j],dp[i-1][j-weight[i]] + value[i])
                }
            }
        }
    }

    console.log(dp)
    return dp[weight.length - 1][bagWeight]
}
// 示例JavaScript代码 - 包含各种质量问题用于测试

// 问题1: 使用var而不是let/const
var globalVar = 'should use const';

// 问题2: 硬编码的敏感信息
const API_KEY = 'sk-1234567890abcdef';
const password = 'hardcoded123';

// 问题3: 复杂的函数，高圈复杂度
function complexFunction(x, y, z) {
    if (x > 0) {
        if (y > 0) {
            if (z > 0) {
                for (var i = 0; i < x; i++) {
                    if (i % 2 === 0) {
                        if (i % 3 === 0) {
                            console.log('Complex logic: ' + i);
                        } else {
                            console.log('Even number: ' + i);
                        }
                    } else {
                        console.log('Odd number: ' + i);
                    }
                }
            }
        }
    }
    return x + y + z;
}

// 问题4: 潜在的安全漏洞 - eval使用
function dangerousFunction(userInput) {
    return eval(userInput);
}

// 问题5: 性能问题 - 字符串拼接
function inefficientStringConcat(arr) {
    var result = '';
    for (var i = 0; i < arr.length; i++) {
        result = result + arr[i] + ', ';
    }
    return result;
}

// 问题6: 缺少错误处理
function riskyFunction(data) {
    return JSON.parse(data).value.nested.property;
}

// 问题7: 重复代码
function processUserData(user) {
    if (user.name) {
        console.log('Processing user: ' + user.name);
        console.log('User ID: ' + user.id);
        console.log('User email: ' + user.email);
    }
}

function processAdminData(admin) {
    if (admin.name) {
        console.log('Processing user: ' + admin.name);
        console.log('User ID: ' + admin.id);
        console.log('User email: ' + admin.email);
    }
}

// 问题8: 未使用的变量
function unusedVariables() {
    var used = 'this is used';
    var unused = 'this is not used';
    var alsoUnused = 42;
    
    console.log(used);
}

// 问题9: 魔法数字
function calculateDiscount(price) {
    if (price > 100) {
        return price * 0.9; // 10% discount
    } else if (price > 50) {
        return price * 0.95; // 5% discount
    }
    return price;
}

// 问题10: 长参数列表
function createUser(firstName, lastName, email, phone, address, city, state, zip, country, age, gender) {
    return {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        address: address,
        city: city,
        state: state,
        zip: zip,
        country: country,
        age: age,
        gender: gender
    };
}

// 导出函数供测试使用
module.exports = {
    complexFunction,
    dangerousFunction,
    inefficientStringConcat,
    riskyFunction,
    processUserData,
    processAdminData,
    unusedVariables,
    calculateDiscount,
    createUser
};
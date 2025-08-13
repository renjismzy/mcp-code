# 示例Python代码 - 包含各种质量问题用于测试

import os
import subprocess
import pickle

# 问题1: 硬编码的敏感信息
API_SECRET = "sk-abcdef1234567890"
DATABASE_PASSWORD = "admin123"

# 问题2: 不安全的函数使用
def unsafe_command_execution(user_input):
    # 安全漏洞：命令注入
    result = subprocess.call(f"ls {user_input}", shell=True)
    return result

def unsafe_deserialization(data):
    # 安全漏洞：不安全的反序列化
    return pickle.loads(data)

# 问题3: 复杂的函数，高圈复杂度
def complex_function(x, y, z, mode):
    if x > 0:
        if y > 0:
            if z > 0:
                if mode == 'add':
                    for i in range(x):
                        if i % 2 == 0:
                            if i % 3 == 0:
                                print(f"Complex logic: {i}")
                            else:
                                print(f"Even number: {i}")
                        else:
                            print(f"Odd number: {i}")
                    return x + y + z
                elif mode == 'multiply':
                    result = 1
                    for i in range(x):
                        if i % 2 == 0:
                            result *= i if i > 0 else 1
                    return result * y * z
                elif mode == 'power':
                    return x ** y ** z
            else:
                return x + y
        else:
            return x
    else:
        return 0

# 问题4: 性能问题 - 低效的字符串拼接
def inefficient_string_concat(items):
    result = ""
    for item in items:
        result = result + str(item) + ", "
    return result

# 问题5: 缺少错误处理
def risky_function(data):
    parsed = eval(data)  # 安全漏洞：使用eval
    return parsed['key']['nested']['value']

# 问题6: 重复代码
def process_user_data(user):
    if user.get('name'):
        print(f"Processing user: {user['name']}")
        print(f"User ID: {user['id']}")
        print(f"User email: {user['email']}")
        print(f"User status: active")

def process_admin_data(admin):
    if admin.get('name'):
        print(f"Processing user: {admin['name']}")
        print(f"User ID: {admin['id']}")
        print(f"User email: {admin['email']}")
        print(f"User status: active")

# 问题7: 全局变量的过度使用
global_counter = 0
global_data = {}

def increment_counter():
    global global_counter
    global_counter += 1

def store_data(key, value):
    global global_data
    global_data[key] = value

# 问题8: 长参数列表
def create_user_profile(first_name, last_name, email, phone, address, 
                       city, state, zip_code, country, age, gender, 
                       occupation, salary, education, marital_status):
    return {
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'phone': phone,
        'address': address,
        'city': city,
        'state': state,
        'zip_code': zip_code,
        'country': country,
        'age': age,
        'gender': gender,
        'occupation': occupation,
        'salary': salary,
        'education': education,
        'marital_status': marital_status
    }

# 问题9: 魔法数字和字符串
def calculate_tax(income):
    if income > 100000:
        return income * 0.35  # 35% tax rate
    elif income > 50000:
        return income * 0.25  # 25% tax rate
    elif income > 25000:
        return income * 0.15  # 15% tax rate
    else:
        return income * 0.1   # 10% tax rate

# 问题10: 未使用的导入和变量
import json  # 未使用的导入
import sys   # 未使用的导入

def unused_variables_function():
    used_var = "This is used"
    unused_var = "This is not used"
    another_unused = 42
    
    print(used_var)
    return True

# 问题11: SQL注入风险（模拟）
def unsafe_query(user_id):
    # 模拟不安全的SQL查询构建
    query = f"SELECT * FROM users WHERE id = {user_id}"
    return query

# 问题12: 弱随机数生成
import random

def generate_token():
    # 安全问题：使用弱随机数生成器
    return str(random.randint(1000, 9999))

if __name__ == "__main__":
    # 测试代码
    print("Testing complex function:")
    result = complex_function(5, 3, 2, 'add')
    print(f"Result: {result}")
    
    print("\nTesting string concatenation:")
    items = [1, 2, 3, 4, 5]
    concat_result = inefficient_string_concat(items)
    print(f"Concatenated: {concat_result}")
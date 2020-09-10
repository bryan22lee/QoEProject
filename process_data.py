import math
import os

import numpy as np
import matplotlib.pyplot as plt
# from scipy import optimize


def f_log(x,A,B,C):
    return A - B*np.log(x + C)

def f_exp(x,A,B,C,D):
    return A * np.exp(B * x) + C * np.exp(D * x)

def check_length(l, name):
    flag = 0
    # 6 videos
    while(len(l) < 6):
        l.append(777)
        flag = 1
    if(flag):
        print("Warning: id- ", name, "has less than 6 samples.")
    return

def process_user(f):
    grade_str = f.readline().strip('\n').split(",")
    video_order_str = f.readline().strip('\n').split(",")
    video_time_str = f.readline().strip('\n').split(",")
    decide_time_str = f.readline().strip('\n').split(",")
    mturkID = f.readline().strip('\n')
    device = f.readline().strip('\n')
    age = f.readline().strip('\n')
    network = f.readline().strip('\n')

    check_length(grade_str, mturkID)
    check_length(video_time_str, mturkID)
    check_length(decide_time_str, mturkID)

    grade =[]
    video_order =[]
    video_time = []
    decide_time=[]
    for i in range(len(grade_str)):
        grade.append(int(grade_str[i]))
        video_order.append(int(video_order_str[i]))
        video_time.append(int(video_time_str[i]))
        decide_time.append(int(decide_time_str[i]))
    result=[grade, video_order, video_time, decide_time, mturkID, device, age, network]
    return result



fileroot = './results'
results=[]
list = os.listdir(fileroot)
print len(list) ," files detected."
for i in range(0, len(list)):
    path = os.path.join(fileroot, list[i])
    if os.path.isfile(path):
        f = open(path, 'r')
        result = process_user(f)
        results.append(result)

def gather_data():
    gather_list =[]
    for i in range(len(results)):
        gather_list.append(results[i][0])
    data = np.array(gather_list)
    print(np.shape(data))
    return data

def save_order():
    order_list = []
    for i in range(len(results)):
        order_list.append(results[i][1])
    order = np.array(order_list)
    print np.shape(order)
    np.save("ms_order.npy", order)
    return order

def look_at_time(order):
    time_list =[]
    for i in range(len(results)):
        time_list.append(results[i][2])
    time = np.array(time_list)
    unordered_time_list =[]
    for i in range(len(results)):
        temp =[]
        for j in range(13):
            temp.append(time[i][order[i][j] - 1])
        unordered_time_list.append(temp)
    unordered_time = np.array(unordered_time_list)
    return np.mean(unordered_time, axis=0), np.mean(time, axis=0)



data =gather_data()
# data[:,[8,9]] = data[:,[9,8]]
# order = save_order()
np.save("./data/ms.npy", data)
# data_mean = np.mean(data, axis=0)

# # unordered, time = look_at_time(order)


# # print(data_mean)



# x_list =[0, 50, 100, 200, 300, 500, 750, 1000, 1250, 1500, 2000, 3000]
# x = np.array(x_list)
# x1 = x
# x2 = x
# A1, B1, C1 = optimize.curve_fit(f_log, x1, data_mean)[0]
# #A2, B2, C2, D2 =optimize.curve_fit(f_exp, x2, data_mean)[0]

# data_log = f_log(x1, A1, B1, C1)
# #data_exp = f_exp(x2, 1.699, -0.002706, 3.259, -0.0003815)



# plt.figure()
# plt.scatter(x[:], data_mean[:], 15,"red")
# plt.plot(x1, data_log, "blue")
# #plt.plot(x2, data_exp, "green")
# plt.show()

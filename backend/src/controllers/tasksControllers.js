export const getAllTasks = (request, response) => {
    response.status(200).send( "Ban co 30 viec can lam");
}

export const createTask = (req, res) => {
    res.status(201).json({message: "Nhiem vu moi da dc them vao thanh cong."});
}

export const updateTask = (req, res) => {
    res.status(200).json({message: "Nhiem vu da duoc update thanh cong"});
}

export const deleteTask = (req, res) => {
    res.status(200).json({message: "Nhiem vu da duoc xoa"});
}
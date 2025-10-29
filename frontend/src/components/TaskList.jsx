import React from 'react';
import TaskEmptyState from './TaskEmptyState';
import TaskCard from './TaskCard';



export const TaskList = () => {
    let filter = "all";
    const filteredTasks = [
        // {
        //     id: 1,
        //     title: "Học React",
        //     status: "active",
        //     completedAt: null,
        //     createdAt: new Date(),
        // },
        // {
        //     id: 2,
        //     title: "Làm bài tập",
        //     status: "completed",
        //     completedAt: new Date(),
        //     createdAt: new Date(),
        // },
    ];

    if (filteredTasks.length === 0 || !filteredTasks) {
        return <TaskEmptyState filter={filter} />;
    }

    return (
        <div className="space-y-3">
            {filteredTasks.map((task, index) => (
                <TaskCard
                    key={tasl._id ?? index}
                    task={task}
                    index={index}
                />
            ))}
        </div>
    );
};
export default TaskList;

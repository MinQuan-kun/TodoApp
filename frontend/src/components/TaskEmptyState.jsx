import React from "react";
import { Card } from "@/components/ui/card";
import { CircleCheck } from "lucide-react";

export const TaskEmptyState = ({filter}) => {
    return (
        <Card
            className="p-8 text-center border-2 bg-gradient-card shadow-custom-md">
            <div className="space-y-3">
                <CircleCheck className="mx-auto size-12 text-muted-foreground" />
                <div>
                    <h3 className="font-medium text-foreground">
                        {filter === 'active'
                            ? "Không có tasks đang làm"
                            : filter === 'completed'
                                ? "Không có tasks đã hoàn thành"
                                : "Không có tasks nào"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {filter === 'all'
                            ? 'Thêm nhiệm vụ mới để bắt đầu!'
                            : `Chuyển sang "Tất cả" để xem nhiệm vụ ${filter === 'active' ? 'đang làm.' : 'đã hoàn thành.'}`}
                    </p>

                </div>
            </div>
        </Card>
    );
};

export default TaskEmptyState;

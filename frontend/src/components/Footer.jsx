import React from 'react';

export const Footer = ({ completedTasksCount = 0, activeTaskCount = 0 }) => {
    return <>
        {completedTasksCount + activeTaskCount > 0 && (
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    {
                        completedTasksCount > 0 && (
                            <>
                                Tuyệt vời! Bạn đã hoàn thành {completedTasksCount} nhiệm vụ.{' '}
                                {
                                    activeTaskCount > 0 && (
                                        <>Còn {activeTaskCount} nhiệm vụ đang chờ bạn hoàn thành.</>
                                    )
                                }
                            </>
                        )
                    }
                    {completedTasksCount === 0 && activeTaskCount > 0 && (
                        <>
                        Bạn có {activeTaskCount} nhiệm vụ đang chờ bạn hoàn thành. Cố lên nhé!
                        </>    
                    )}
                </p>
            </div>
        )}
    </>
};

export default Footer;
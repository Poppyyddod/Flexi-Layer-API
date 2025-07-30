export type StartWorkRecordType = {
    emp_id: number;

    start_latitude: string;
    start_longitude: string;
    start_at: string;
};

export type EndWorkRecordType = {
    end_latitude: string;
    end_longitude: string;
}

export type LeaveWorkRecordType = {
    emp_id?: number;

    start_latitude: string;
    start_longitude: string;

    work_record_state: string;
}


export type ApproveLeaveWorkRecordType = {
    approve_state: 'considering' | 'approved' | 'rejected';
}
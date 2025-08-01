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

export type CreateLeaveDetailType = {
    emp_id?: number;
    leave_type_name: string;
    leave_start_at: string;
    leave_end_at: string;
    detail: string;
    image?: string;
}


export type ApproveLeaveDetailType = {
    leave_detail_id: number;
    leave_state: 'pending' | 'approved' | 'rejected';
}
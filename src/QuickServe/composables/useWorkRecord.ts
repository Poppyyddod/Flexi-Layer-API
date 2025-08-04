

function useWorkRecord() {
    const paramWorkRecordStateArr = ["nofilter", "working", "ended", "leave"];
    const paramApproveStateArr = ["nofilter", "approved", "pending", "rejected"];
    const paramLeaveStateArr = ["nofilter", "approved", "pending", "rejected"];

    return {
        paramApproveStateArr,
        paramWorkRecordStateArr,
        paramLeaveStateArr
    }
}

export default useWorkRecord;
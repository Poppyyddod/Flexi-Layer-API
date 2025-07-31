

function useWorkRecord() {
    const paramWorkRecordStateArr = ["nofilter", "approved", "leave", "rejected"];
    const paramApproveStateArr = ["nofilter", "approved", "considering", "rejected"];

    return {
        paramApproveStateArr,
        paramWorkRecordStateArr
    }
}

export default useWorkRecord;
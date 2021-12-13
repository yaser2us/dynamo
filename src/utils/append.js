import convertToArrayPayload from './convertToArrayPayload';
export default function append(data, value) {
    return [...convertToArrayPayload(data), ...convertToArrayPayload(value)];
}
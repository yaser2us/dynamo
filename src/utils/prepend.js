import convertToArrayPayload from './convertToArrayPayload';
export default function prepend(data, value) {
    return [...convertToArrayPayload(value), ...convertToArrayPayload(data)];
}
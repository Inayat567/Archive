
export default function useSlicedContacts(contacts: any[], pagination: number, limit: number){
    const min = pagination * limit;
    const max = ((pagination + 1) * limit) - 1;
    return contacts.slice(min, max+1);
}
import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

export const contactsService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...contacts];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const contact = contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  },

  async create(contactData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Find highest ID and add 1
    const maxId = Math.max(...contacts.map(c => c.Id), 0);
    const newContact = {
      Id: maxId + 1,
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, contactData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    const updatedContact = {
      ...contacts[index],
      ...contactData,
      Id: parseInt(id), // Ensure ID stays as integer
      updatedAt: new Date().toISOString()
    };
    
    contacts[index] = updatedContact;
    return { ...updatedContact };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    contacts.splice(index, 1);
    return true;
  }
};
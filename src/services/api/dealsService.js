import dealsData from "@/services/mockData/deals.json";

let deals = [...dealsData];

export const dealsService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...deals];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const deal = deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  },

  async getByContactId(contactId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return deals.filter(d => d.contactId === parseInt(contactId)).map(d => ({ ...d }));
  },

  async create(dealData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Find highest ID and add 1
    const maxId = Math.max(...deals.map(d => d.Id), 0);
    const newDeal = {
      Id: maxId + 1,
      ...dealData,
      contactId: parseInt(dealData.contactId), // Ensure contactId is integer
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, dealData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    const updatedDeal = {
      ...deals[index],
      ...dealData,
      Id: parseInt(id), // Ensure ID stays as integer
      contactId: parseInt(dealData.contactId || deals[index].contactId), // Ensure contactId is integer
      updatedAt: new Date().toISOString()
    };
    
    deals[index] = updatedDeal;
    return { ...updatedDeal };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    deals.splice(index, 1);
    return true;
  }
};
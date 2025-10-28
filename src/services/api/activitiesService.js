import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

export const activitiesService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...activities];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const activity = activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  },

  async getByContactId(contactId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return activities
      .filter(a => a.contactId === parseInt(contactId))
      .map(a => ({ ...a }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getByDealId(dealId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return activities
      .filter(a => a.dealId === parseInt(dealId))
      .map(a => ({ ...a }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async create(activityData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Find highest ID and add 1
    const maxId = Math.max(...activities.map(a => a.Id), 0);
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      contactId: parseInt(activityData.contactId), // Ensure contactId is integer
      dealId: activityData.dealId ? parseInt(activityData.dealId) : null, // Ensure dealId is integer if provided
      createdAt: new Date().toISOString()
    };
    
    activities.push(newActivity);
    return { ...newActivity };
  },

  async update(id, activityData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    const updatedActivity = {
      ...activities[index],
      ...activityData,
      Id: parseInt(id), // Ensure ID stays as integer
      contactId: parseInt(activityData.contactId || activities[index].contactId), // Ensure contactId is integer
      dealId: activityData.dealId ? parseInt(activityData.dealId) : activities[index].dealId
    };
    
    activities[index] = updatedActivity;
    return { ...updatedActivity };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    activities.splice(index, 1);
    return true;
  }
};
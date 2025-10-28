import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  try {
    // Parse request body
    const body = await req.json();
    
    if (!body || !body.contact) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Contact data is required in request body'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const contact = body.contact;

    // Get CompanyHub API key from secrets
    const apiKey = await apper.getSecret('COMPANYHUB_API_KEY');
    
    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        message: 'CompanyHub API key not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Map Pipeline Pro contact fields to CompanyHub Contact format
    const companyHubContact = {
      name: contact.name_c || '',
      email: contact.email_c || '',
      phone: contact.phone_c || '',
      company: contact.company_c || '',
      tags: contact.tags_c || '',
      notes: contact.notes_c || '',
      photo_url: contact.photo_url_c || ''
    };

    // Call CompanyHub API to create contact
    const companyHubResponse = await fetch('https://api.companyhub.com/v1/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(companyHubContact)
    });

    const responseData = await companyHubResponse.json();

    if (!companyHubResponse.ok) {
      return new Response(JSON.stringify({
        success: false,
        message: responseData.message || 'Failed to create contact in CompanyHub',
        details: responseData
      }), {
        status: companyHubResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Contact successfully synced to CompanyHub',
      companyHubContactId: responseData.id || responseData.contactId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'Internal server error while syncing to CompanyHub',
      error: error.toString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
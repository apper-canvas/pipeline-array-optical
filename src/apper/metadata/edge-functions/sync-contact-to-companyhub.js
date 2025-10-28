import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  try {
    // Parse request body
    const body = await req.json();

    // Validate required fields
    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid request body'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { contactId, name, email, phone, company, science_marks_c } = body;

    // Validate science_marks_c exists
    if (science_marks_c === undefined || science_marks_c === null) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Science marks field is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if science_marks_c > 60
    const marksValue = parseInt(science_marks_c);
    if (isNaN(marksValue) || marksValue <= 60) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Contact not synced - science marks <= 60',
        synced: false,
        science_marks_c: marksValue
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Retrieve CompanyHub API key
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

    // Prepare CompanyHub contact payload
    const companyHubPayload = {
      name: name || '',
      email: email || '',
      phone: phone || '',
      company: company || '',
      science_marks: marksValue,
      source: 'pipeline-pro',
      original_contact_id: contactId
    };

    // Make request to CompanyHub API
    const companyHubResponse = await fetch('https://api.companyhub.com/v1/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(companyHubPayload)
    });

    // Handle CompanyHub API response
    if (!companyHubResponse.ok) {
      const errorText = await companyHubResponse.text();
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to sync contact to CompanyHub',
        companyHubStatus: companyHubResponse.status,
        companyHubError: errorText
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const companyHubData = await companyHubResponse.json();

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      message: 'Contact successfully synced to CompanyHub',
      synced: true,
      science_marks_c: marksValue,
      companyHubContactId: companyHubData.id || companyHubData.contactId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal server error',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

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
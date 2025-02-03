import React, { useState } from 'react';
import { Building2, Clock, FileText, Image, Search, Upload, User } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    companyRegistration: '',
    areaCode: '',
    phoneNumber: '',
    email: '',
    address: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    businessType: '',
    otherBusinessType: '',
    description: '',
    hours: {
      weekdayOpen: '08:00',
      weekdayClosed: '17:00',
      saturdayOpen: '08:00',
      saturdayClosed: '15:00',
      sundayOpen: '',
      sundayClosed: ''
    },
    keywords: Array(8).fill('')
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formattedData = {
      timestamp: new Date().toISOString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      businessName: formData.businessName,
      companyRegistration: formData.companyRegistration,
      phone: `${formData.areaCode}-${formData.phoneNumber}`,
      email: formData.email,
      fullAddress: `${formData.address.street1}, ${formData.address.street2 ? formData.address.street2 + ', ' : ''}${formData.address.city}, ${formData.address.state} ${formData.address.zip}, ${formData.address.country}`,
      businessType: formData.businessType === 'other' ? formData.otherBusinessType : formData.businessType,
      weekdayHours: `${formData.hours.weekdayOpen} - ${formData.hours.weekdayClosed}`,
      saturdayHours: `${formData.hours.saturdayOpen} - ${formData.hours.saturdayClosed}`,
      sundayHours: formData.hours.sundayOpen && formData.hours.sundayClosed ? `${formData.hours.sundayOpen} - ${formData.hours.sundayClosed}` : 'Closed',
      keywords: formData.keywords.filter(k => k).join(', ')
    };

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbz7IXgy8tcJ5vb1g0yXAQB9DkQMhbDLXkDPZSs12ZugM_6OF3rF6h8bYSrLrymDKbQU/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) throw new Error('Submission failed');
      
      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        businessName: '',
        companyRegistration: '',
        areaCode: '',
        phoneNumber: '',
        email: '',
        address: {
          street1: '',
          street2: '',
          city: '',
          state: '',
          zip: '',
          country: ''
        },
        businessType: '',
        otherBusinessType: '',
        description: '',
        hours: {
          weekdayOpen: '08:00',
          weekdayClosed: '17:00',
          saturdayOpen: '08:00',
          saturdayClosed: '15:00',
          sundayOpen: '',
          sundayClosed: ''
        },
        keywords: Array(8).fill('')
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      // Handle keywords array updates
      if (name.startsWith('keywords[')) {
        const index = parseInt(name.match(/\[(\d+)\]/)?.[1] || '0');
        return {
          ...prev,
          keywords: prev.keywords.map((k, i) => i === index ? value : k)
        };
      }
      
      // Handle nested object updates
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: value
          }
        };
      }
      
      // Handle regular field updates
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const inputClasses = "mt-1 block w-full rounded-md border-[#f5f5f5] border-[3px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] focus:border-blue-500 focus:ring-blue-500 bg-white px-3 py-2";
  const selectClasses = "mt-1 block w-full rounded-md border-[#f5f5f5] border-[3px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] focus:border-blue-500 focus:ring-blue-500 bg-white";
  const fileInputClasses = "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-[#f5f5f5] border-[3px] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.1)]";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Your Go To Guys Registration</h1>
          <p className="mt-2 text-lg text-gray-600">Register Your Free Business Listing</p>
          <p className="text-sm text-gray-500">Please provide all required details to List your business with us free.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-lg">
          {/* Business Owner Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
              <User className="h-6 w-6" />
              <h2>Business Owner</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>
            </div>
          </section>

          {/* Business Details Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
              <Building2 className="h-6 w-6" />
              <h2>Business Details</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Name*</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Registration Number*</label>
                <input
                  type="text"
                  name="companyRegistration"
                  value={formData.companyRegistration}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>
              
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Area Code*</label>
                  <input
                    type="text"
                    name="areaCode"
                    value={formData.areaCode}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="ex: myname@example.com"
                  className={inputClasses}
                />
              </div>
            </div>
          </section>

          {/* Address Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Address*</h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="address.street1"
                value={formData.address.street1}
                onChange={handleChange}
                placeholder="Street Address"
                required
                className={inputClasses}
              />
              <input
                type="text"
                name="address.street2"
                value={formData.address.street2}
                onChange={handleChange}
                placeholder="Street Address Line 2"
                className={inputClasses}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                  className={inputClasses}
                />
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="State / Province"
                  required
                  className={inputClasses}
                />
                <input
                  type="text"
                  name="address.zip"
                  value={formData.address.zip}
                  onChange={handleChange}
                  placeholder="Postal / Zip Code"
                  required
                  className={inputClasses}
                />
              </div>
              <select
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                required
                className={selectClasses}
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                {/* Add more countries as needed */}
              </select>
            </div>
          </section>

          {/* Business Type Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Type of Business*</h2>
            <div className="space-y-4">
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                required
                className={selectClasses}
              >
                <option value="">Choose From Drop down or Type Your Own</option>
                <option value="retail">Retail</option>
                <option value="service">Service</option>
                <option value="restaurant">Restaurant</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                name="otherBusinessType"
                value={formData.otherBusinessType}
                onChange={handleChange}
                placeholder="Others, please specify"
                className={inputClasses}
              />
            </div>
          </section>

          {/* Business Hours Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
              <Clock className="h-6 w-6" />
              <h2>Business Operating Hours</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monday To Friday</label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <input
                      type="time"
                      name="hours.weekdayOpen"
                      value={formData.hours.weekdayOpen}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                    <input
                      type="time"
                      name="hours.weekdayClosed"
                      value={formData.hours.weekdayClosed}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Saturday</label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <input
                      type="time"
                      name="hours.saturdayOpen"
                      value={formData.hours.saturdayOpen}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                    <input
                      type="time"
                      name="hours.saturdayClosed"
                      value={formData.hours.saturdayClosed}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sunday (Optional)</label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <input
                      type="time"
                      name="hours.sundayOpen"
                      value={formData.hours.sundayOpen}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                    <input
                      type="time"
                      name="hours.sundayClosed"
                      value={formData.hours.sundayClosed}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Keywords Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
              <Search className="h-6 w-6" />
              <h2>Search Engine Optimization Keywords</h2>
            </div>
            <p className="text-sm text-gray-500">Enter up to 8 Search Keywords matching your Business</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-700">Keyword {i + 1}</label>
                  <input
                    type="text"
                    name={`keywords[${i}]`}
                    value={formData.keywords[i]}
                    onChange={handleChange}
                    placeholder={`Enter Business Keyword ${i + 1}`}
                    className={inputClasses}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* File Upload Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
              <Upload className="h-6 w-6" />
              <h2>File & Document Uploads</h2>
            </div>
            <p className="text-sm text-gray-500">Upload your Company Logo, Photos or Company Profile</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-gray-400" />
                <label className="block text-sm font-medium text-gray-700">Upload Business Logo & Pictures</label>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className={fileInputClasses}
              />
              
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <label className="block text-sm font-medium text-gray-700">Company Profile</label>
              </div>
              <input
                type="file"
                accept=".pdf"
                className={fileInputClasses}
              />
            </div>
          </section>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white ${
                isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>

            {submitStatus === 'success' && (
              <p className="mt-2 text-sm text-green-600">Form submitted successfully!</p>
            )}
            {submitStatus === 'error' && (
              <p className="mt-2 text-sm text-red-600">Error submitting form. Please try again.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
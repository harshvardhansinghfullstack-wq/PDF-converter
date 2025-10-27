'use client';

import React from 'react';

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '4px',
  border: '1px solid #c9cccf',
  fontSize: '14px',
  backgroundColor: '#fff',
};

const labelStyle = {
  fontSize: '13px',
  fontWeight: 500,
  marginBottom: '6px',
  display: 'block',
  color: '#202223',
};

const sectionStyle = {
  border: '1px solid #e1e3e5',
  borderRadius: '8px',
  padding: '20px',
  backgroundColor: '#fff',
  marginBottom: '16px',
};

const sidebarLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  color: '#6d7175',
  textDecoration: 'none',
  fontWeight: 400,
  fontSize: '14px',
  cursor: 'pointer',
  borderRadius: '6px',
  margin: '2px 12px',
};

const sidebarLinkActiveStyle = {
  ...sidebarLinkStyle,
  backgroundColor: '#f1f2f3',
  color: '#202223',
  fontWeight: 500,
};

const AddProductPage = () => {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f6f6f7', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '240px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e1e3e5',
          paddingTop: '16px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      >
        <div style={{ padding: '0 16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 600, color: '#202223' }}>
            <span style={{ backgroundColor: '#95bf47', color: 'white', padding: '4px 6px', borderRadius: '4px', marginRight: '8px', fontSize: '12px' }}>
              <i className="fa-solid fa-bag-shopping"></i>
            </span>
            FileMint
          </div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={sidebarLinkStyle}>
            <i className="fa-solid fa-house" style={{ marginRight: 8 }}></i> Home
          </div>
          <div style={sidebarLinkStyle}>
            <i className="fa-solid fa-box" style={{ marginRight: 8 }}></i> Orders
          </div>
          <div style={sidebarLinkActiveStyle}>
            <i className="fa-solid fa-clipboard-list" style={{ marginRight: 8 }}></i> Products
          </div>
          <div style={{ ...sidebarLinkStyle, paddingLeft: '32px', fontSize: '13px' }}>
            Collections
          </div>
          <div style={{ ...sidebarLinkStyle, paddingLeft: '32px', fontSize: '13px' }}>
            Inventory
          </div>
          <div style={{ ...sidebarLinkStyle, paddingLeft: '32px', fontSize: '13px' }}>
            Purchase orders
          </div>
          <div style={{ ...sidebarLinkStyle, paddingLeft: '32px', fontSize: '13px' }}>
            Transfers
          </div>
          <div style={{ ...sidebarLinkStyle, paddingLeft: '32px', fontSize: '13px' }}>
            Gift cards
          </div>
          <div style={sidebarLinkStyle}>
            <i className="fa-solid fa-users" style={{ marginRight: 8 }}></i> Customers
          </div>
          <div style={sidebarLinkStyle}>
            <i className="fa-solid fa-chart-line" style={{ marginRight: 8 }}></i> Marketing
          </div>
          <div style={sidebarLinkStyle}>
            <i className="fa-solid fa-bullseye" style={{ marginRight: 8 }}></i> Discounts
          </div>
          <div style={sidebarLinkStyle}>
            <i className="fa-solid fa-file" style={{ marginRight: 8 }}></i> Content
          </div>
          <div style={sidebarLinkStyle}>
            <i className="fa-solid fa-globe" style={{ marginRight: 8 }}></i> Markets
          </div>
          <div style={sidebarLinkStyle}>
            <i className="fa-solid fa-chart-column" style={{ marginRight: 8 }}></i> Analytics
          </div>
          <div style={sidebarLinkStyle}>
            <i className="fa-solid fa-cart-shopping" style={{ marginRight: 8 }}></i> Online Store
          </div>
          <div style={sidebarLinkStyle}>
            <i className="fa-solid fa-gear" style={{ marginRight: 8 }}></i> Settings
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div
        style={{
          marginLeft: '240px',
          flex: 1,
          backgroundColor: '#f6f6f7',
        }}
      >
        {/* Header */}
        <div style={{ 
          backgroundColor: '#202223', 
          padding: '8px 24px', 
          borderBottom: '1px solid #e1e3e5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '12px', marginRight: '8px' }}></i>
            <span style={{ fontSize: '14px' }}>Unsaved product</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ 
              padding: '6px 12px', 
              backgroundColor: 'transparent', 
              color: '#fff', 
              border: '1px solid #6d7175',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Discard
            </button>
            <button style={{ 
              padding: '6px 12px', 
              backgroundColor: '#2c6ecb', 
              color: '#fff', 
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Save
            </button>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <i className="fa-solid fa-pen-to-square" style={{ fontSize: '14px', marginRight: '8px' }}></i>
            <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Add product</h1>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            {/* LEFT PANEL */}
            <div style={{ flex: 2, minWidth: '600px' }}>
              <div style={sectionStyle}>
                {/* Title */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Title</label>
                  <input type="text" placeholder="Short sleeve t-shirt" style={inputStyle} />
                </div>

                {/* Description */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Description</label>
                  <div style={{ border: '1px solid #c9cccf', borderRadius: '4px', backgroundColor: '#fff' }}>
                    <div style={{ 
                      padding: '8px 12px', 
                      borderBottom: '1px solid #e1e3e5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px'
                    }}>
                      <select style={{ border: 'none', background: 'transparent', fontSize: '14px' }}>
                        <option>Paragraph</option>
                      </select>
                      <i className="fa-solid fa-pen"></i>
                      <span style={{ fontWeight: 'bold' }}>B</span>
                      <span style={{ fontStyle: 'italic' }}>I</span>
                      <span style={{ textDecoration: 'underline' }}>U</span>
                      <i className="fa-solid fa-font"></i>
                      <i className="fa-solid fa-bars"></i>
                      <i className="fa-solid fa-link"></i>
                      <i className="fa-regular fa-face-smile"></i>
                      <i className="fa-solid fa-ellipsis"></i>
                      <i className="fa-solid fa-code"></i>
                    </div>
                    <textarea 
                      rows={4} 
                      style={{ 
                        width: '100%', 
                        border: 'none', 
                        padding: '12px', 
                        resize: 'vertical',
                        fontSize: '14px',
                        outline: 'none'
                      }} 
                      placeholder="Enter product description..." 
                    />
                  </div>
                </div>
              </div>

              {/* Media */}
              <div style={sectionStyle}>
                <label style={labelStyle}>Media</label>
                <div style={{ 
                  border: '2px dashed #c9cccf', 
                  borderRadius: '8px', 
                  padding: '40px 20px',
                  textAlign: 'center',
                  backgroundColor: '#fafbfb'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <button style={{ 
                      padding: '8px 16px', 
                      backgroundColor: '#fff', 
                      border: '1px solid #c9cccf',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      marginRight: '12px'
                    }}>
                      Upload new
                    </button>
                    <button style={{ 
                      padding: '8px 16px', 
                      backgroundColor: 'transparent', 
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                      color: '#2c6ecb'
                    }}>
                      Select existing
                    </button>
                  </div>
                  <div style={{ fontSize: '13px', color: '#6d7175' }}>
                    Accepts images, videos, or 3D models
                  </div>
                </div>
              </div>

              {/* Category */}
              <div style={sectionStyle}>
                <label style={labelStyle}>Category</label>
                <select style={inputStyle}>
                  <option>Choose a product category</option>
                </select>
                <div style={{ fontSize: '13px', color: '#6d7175', marginTop: '8px' }}>
                  Determines tax rates and adds metafields to improve search, filters, and cross-channel sales
                </div>
              </div>

              {/* Pricing */}
              <div style={sectionStyle}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', margin: '0 0 16px 0' }}>Pricing</h3>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Price</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6d7175' }}>₹</span>
                      <input type="number" placeholder="0.00" style={{ ...inputStyle, paddingLeft: '28px' }} />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Compare-at price</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6d7175' }}>₹</span>
                      <input type="number" placeholder="0.00" style={{ ...inputStyle, paddingLeft: '28px' }} />
                      <i className="fa-solid fa-circle-info" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6d7175' }}></i>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" style={{ marginRight: '8px' }} />
                    Charge tax on this product
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Cost per item</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6d7175' }}>₹</span>
                      <input type="number" placeholder="0.00" style={{ ...inputStyle, paddingLeft: '28px' }} />
                      <i className="fa-solid fa-circle-info" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6d7175' }}></i>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Profit</label>
                    <input placeholder="--" style={{ ...inputStyle, backgroundColor: '#f6f6f7', color: '#6d7175' }} disabled />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Margin</label>
                    <input placeholder="--" style={{ ...inputStyle, backgroundColor: '#f6f6f7', color: '#6d7175' }} disabled />
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div style={sectionStyle}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', margin: '0 0 16px 0' }}>Inventory</h3>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" style={{ marginRight: '8px' }} />
                    Track quantity
                  </label>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Quantity</label>
                  <input type="number" placeholder="0" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Shop location</label>
                  <input type="number" placeholder="0" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" style={{ marginRight: '8px' }} />
                    Continue selling when out of stock
                  </label>
                </div>
                <div>
                  <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" style={{ marginRight: '8px' }} />
                    This product has a SKU or barcode
                  </label>
                </div>
              </div>

              {/* Shipping */}
              <div style={sectionStyle}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', margin: '0 0 16px 0' }}>Shipping</h3>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" defaultChecked style={{ marginRight: '8px' }} />
                    This is a physical product
                  </label>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Weight</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="number" placeholder="0.0" style={{ ...inputStyle, flex: 1 }} />
                    <select style={{ ...inputStyle, flex: 'none', width: '80px' }}>
                      <option>kg</option>
                    </select>
                  </div>
                </div>
                <div style={{ color: '#2c6ecb', fontSize: '14px', cursor: 'pointer' }}>
                  <i className="fa-solid fa-plus" style={{ marginRight: 4 }}></i> Add customs information
                </div>
              </div>

              {/* Variants */}
              <div style={sectionStyle}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', margin: '0 0 16px 0' }}>Variants</h3>
                <div style={{ color: '#2c6ecb', fontSize: '14px', cursor: 'pointer' }}>
                  <i className="fa-solid fa-plus" style={{ marginRight: 4 }}></i> Add options like size or color
                </div>
              </div>

              {/* SEO */}
              <div style={sectionStyle}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', margin: '0 0 16px 0' }}>Search engine listing</h3>
                <div style={{ fontSize: '13px', color: '#6d7175', marginBottom: '16px' }}>
                  Add a title and description to see how this product might appear in a search engine listing
                </div>
                <div style={{ color: '#2c6ecb', fontSize: '14px', cursor: 'pointer' }}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={sectionStyle}>
                {/* Status */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle}>
                    <option>Active</option>
                    <option>Draft</option>
                  </select>
                </div>

                {/* Publishing */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Publishing</label>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i className="fa-solid fa-store" style={{ marginRight: 8 }}></i>
                      <span style={{ fontSize: '14px' }}>Online Store</span>
                    </div>
                    <span style={{ color: '#2c6ecb', fontSize: '14px', cursor: 'pointer' }}>Manage</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <i className="fa-solid fa-store" style={{ marginRight: 8 }}></i>
                    <span style={{ fontSize: '14px' }}>Point of Sale</span>
                  </div>
                </div>

                {/* Product Organization */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Product organization <i className="fa-solid fa-circle-info"></i></label>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ ...labelStyle, fontSize: '13px', color: '#6d7175' }}>Type</label>
                    <input style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ ...labelStyle, fontSize: '13px', color: '#6d7175' }}>Vendor</label>
                    <input style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ ...labelStyle, fontSize: '13px', color: '#6d7175' }}>Collections</label>
                    <input style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '13px', color: '#6d7175' }}>Tags</label>
                    <input style={inputStyle} />
                  </div>
                </div>

                {/* Theme Template */}
                <div>
                  <label style={labelStyle}>Theme template</label>
                  <select style={inputStyle}>
                    <option>Default product</option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <button
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#2c6ecb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;

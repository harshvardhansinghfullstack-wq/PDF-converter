'use client';

import React from 'react';

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f6f6f7'
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e1e3e5',
    paddingTop: '16px',
    height: '100vh',
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
  },
  main: {
    marginLeft: '240px',
    flex: 1,
    padding: '30px',
    overflowY: 'auto' as 'auto',
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '20px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '20px',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  textarea: {
    width: '100%',
    minHeight: '200px',
    padding: '10px',
    marginTop: '5px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  label: {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '5px',
  },
  radioGroup: {
    marginBottom: '15px',
  },
  radioOption: {
    marginRight: '20px',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  saveButton: {
    padding: '6px 12px',
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
    alignSelf: 'flex-end',
    fontSize: '12px'
  },
  sidebarSectionTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#6d7175',
    margin: '8px 16px 4px',
  },
  sidebarItem: {
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
  },
  sidebarItemActive: {
    backgroundColor: '#f1f2f3',
    color: '#202223',
    fontWeight: 500,
  },
  rightColumn: {
    width: '300px',
    marginLeft: '20px',
    flexShrink: 0,
  },
  contentRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
  },
  mainColumn: {
    flex: 1,
  },
};

export default function AddPage() {
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={{ padding: '0 16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 600, color: '#202223' }}>
            <span style={{ backgroundColor: '#95bf47', color: 'white', padding: '4px 6px', borderRadius: '4px', marginRight: '8px', fontSize: '12px' }}>
              <i className="fa-solid fa-bag-shopping"></i>
            </span>
            FileMint
          </div>
        </div>
        <nav>
          <div style={styles.sidebarItem}><i className="fa-solid fa-house" style={{ marginRight: 8 }}></i> Home</div>
          <div style={styles.sidebarItem}><i className="fa-solid fa-box" style={{ marginRight: 8 }}></i> Orders</div>
          <div style={styles.sidebarItem}><i className="fa-solid fa-clipboard-list" style={{ marginRight: 8 }}></i> Products</div>
          <div style={styles.sidebarItem}><i className="fa-solid fa-users" style={{ marginRight: 8 }}></i> Customers</div>
          <div style={styles.sidebarItem}><i className="fa-solid fa-chart-line" style={{ marginRight: 8 }}></i> Marketing</div>
          <div style={styles.sidebarItem}><i className="fa-solid fa-bullseye" style={{ marginRight: 8 }}></i> Discounts</div>
          <div style={styles.sidebarItem}><i className="fa-solid fa-file" style={{ marginRight: 8 }}></i> Content</div>
          <div style={styles.sidebarItem}><i className="fa-solid fa-globe" style={{ marginRight: 8 }}></i> Markets</div>
          <div style={styles.sidebarItem}><i className="fa-solid fa-chart-column" style={{ marginRight: 8 }}></i> Analytics</div>
          <div style={styles.sidebarSectionTitle}>Sales channels</div>
          <div style={styles.sidebarItem}><i className="fa-solid fa-cart-shopping" style={{ marginRight: 8 }}></i> Online Store</div>
          <div style={{ paddingLeft: '10px' }}>
            <div style={styles.sidebarItem}><i className="fa-solid fa-palette" style={{ marginRight: 8 }}></i> Themes</div>
            <div style={{ ...styles.sidebarItem, ...styles.sidebarItemActive }}><i className="fa-solid fa-file-lines" style={{ marginRight: 8 }}></i> Pages</div>
            <div style={styles.sidebarItem}><i className="fa-solid fa-sliders" style={{ marginRight: 8 }}></i> Preferences</div>
          </div>
        </nav>
      </aside>

      {/* Main Content Layout */}
      <div style={styles.main}>
        <div style={styles.heading}>Add page</div>
        <div style={styles.contentRow}>
          <div style={styles.mainColumn}>
            <div style={styles.card}>
              <input type="text" placeholder="e.g. about us, sizing chart, FAQ" style={styles.input} />
              <textarea placeholder="Content" style={styles.textarea} />
            </div>

            <div style={styles.card}>
              <div style={styles.label}>Search engine listing</div>
              <input type="text" placeholder="Page title" maxLength={70} style={styles.input} />
              <textarea placeholder="Meta description" maxLength={160} style={styles.textarea} />
              <div>
                <label style={styles.label}>URL handle</label>
                <input type="text" placeholder="pages/" style={styles.input} />
                <div style={{ fontSize: '14px', color: '#666' }}>
                  https://g1zgz6-zv.myshopify.com/pages/
                </div>
              </div>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.card}>
              <div style={styles.label}>Visibility</div>
              <div style={styles.radioGroup}>
                <label style={styles.radioOption}>
                  <input type="radio" name="visibility" /> Visible
                </label>
                <label>
                  <input type="radio" name="visibility" defaultChecked /> Hidden
                </label>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.label}>Template</div>
              <select style={styles.select}>
                <option>Default page</option>
              </select>
            </div>
          </div>
        </div>

        <button style={styles.saveButton} disabled>
          Save
        </button>
      </div>
    </div>
  );
}

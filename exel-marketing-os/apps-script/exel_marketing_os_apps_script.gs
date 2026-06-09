/**
 * EXEL Marketing Performance OS — Google Apps Script
 * מערכת ניהול פרסום, לידים ו-ROI
 * Version: 2.0
 */

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const SHEET_NAMES = {
  CONTROL_CENTER:    '00_מרכז פיקוד',
  MASTER_INPUT:      '01_נתוני פרסום',
  INVOICE_REGISTRY:  '02_חשבוניות',
  FUNNEL_DASHBOARD:  '03_משפך',
  MONTHLY_DASHBOARD: '04_מגמה חודשית',
  CHANNEL_DASHBOARD: '05_ערוצים',
  BUDGET_PLAN:       '06_תקציב',
  CAMPAIGNS:         '07_קמפיינים',
  QA_AUDIT:          '11_QA',
  SETTINGS:          '12_הגדרות',
  SETUP_GUIDE:       '13_מדריך',
  CHANGELOG:         '14_שינויים',
};

const HEBREW_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

// ─── MENU ───────────────────────────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('★ EXEL Marketing OS')
    .addItem('🔄 רענן דשבורד', 'refreshDashboard')
    .addSeparator()
    .addItem('➕ הוסף שורות חודש חדש', 'addNewMonthRows')
    .addItem('✔️ בדוק נתונים (QA)', 'validateData')
    .addSeparator()
    .addItem('📄 דוח ניהול חודשי', 'generateMonthlyManagementReport')
    .addItem('💸 דוח חשבוניות חסרות', 'generateMissingInvoiceReport')
    .addItem('📈 ייצוא PDF למרכז פיקוד', 'exportDashboardPdf')
    .addSeparator()
    .addItem('📁 צור תיקיית ב-Drive', 'createMonthlyDriveFolder')
    .addItem('🔒 הגן נוסחאות', 'protectFormulaColumns')
    .addSeparator()
    .addItem('❓ מדריך שימוש', 'openSetupGuide')
    .addToUi();
}

// ─── CORE FUNCTIONS ────────────────────────────────────────────────────────────

function refreshDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  try {
    // Force recalculation
    SpreadsheetApp.flush();
    const ui = SpreadsheetApp.getUi();
    ui.alert('✅ הדשבורד רוענן בהצלחה');
  } catch (e) {
    SpreadsheetApp.getUi().alert('❌ שגיאה: ' + e.toString());
  }
}

function addNewMonthRows() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const settingsSheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
  if (!settingsSheet) { ui.alert('לא נמצאה לשונית הגדרות'); return; }

  const year  = settingsSheet.getRange('B2').getValue();
  const month = settingsSheet.getRange('B3').getValue();
  const monthName = HEBREW_MONTHS[month - 1];
  const monthKey  = year + '-' + String(month).padStart(2, '0');

  const masterSheet = ss.getSheetByName(SHEET_NAMES.MASTER_INPUT);
  if (!masterSheet) { ui.alert('לא נמצאה לשונית נתוני פרסום'); return; }

  const channels = [
    'Facebook', 'Instagram', 'Google Search', 'TikTok', 'Referral'
  ];

  const confirm = ui.alert(
    'הוספת שורות ל' + monthName + ' ' + year,
    'האם להוסיף ' + channels.length + ' שורות לחודש ' + monthName + ' ' + year + '?',
    ui.ButtonSet.YES_NO
  );

  if (confirm !== ui.Button.YES) return;

  const lastRow = masterSheet.getLastRow();
  channels.forEach((channel, i) => {
    masterSheet.appendRow([
      Utilities.getUuid(),
      year,
      month,
      monthKey,
      new Date(),
      channel,
      '', // sub channel
      '', // campaign name
      '', // objective
      '', // project
      '', // marketing owner
      '', // sales owner
      'ILS',
      0, 0, 0, // gross, vat, net spend
      'כן', // invoice required
      'חסרה', // invoice status
    ]);
  });

  SpreadsheetApp.flush();
  ui.alert('✅ נוספו ' + channels.length + ' שורות ל' + monthName + ' ' + year);
}

function validateData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const masterSheet = ss.getSheetByName(SHEET_NAMES.MASTER_INPUT);
  const qaSheet     = ss.getSheetByName(SHEET_NAMES.QA_AUDIT);

  if (!masterSheet || !qaSheet) {
    ui.alert('לשוניות דרושות לא נמצאו');
    return;
  }

  const data    = masterSheet.getDataRange().getValues();
  const issues  = [];
  const headers = data[0];

  // Column indices (adjust if your columns differ)
  const COL = {
    CHANNEL:         5,
    NET_SPEND:       15,
    INVOICE_STATUS:  17,
    LEADS:           21,
    MEETINGS:        26,
    CLOSINGS:        28,
    ACTUAL_REVENUE:  32,
    DATA_OWNER:      36,
  };

  for (let i = 1; i < data.length; i++) {
    const row    = data[i];
    const rowNum = i + 1;

    if (!row[COL.CHANNEL])                                issues.push([rowNum, 'ערוץ חסר', 'שגיאה']);
    if (row[COL.NET_SPEND] > 0 && row[COL.INVOICE_STATUS] === 'חסרה')  issues.push([rowNum, 'הוצאה ללא חשבונית', 'שגיאה']);
    if (Number(row[COL.CLOSINGS]) > Number(row[COL.MEETINGS]))    issues.push([rowNum, 'סגירות > פגישות', 'שגיאה']);
    if (Number(row[COL.ACTUAL_REVENUE]) > 0 && Number(row[COL.CLOSINGS]) === 0) issues.push([rowNum, 'הכנסות בלא סגירות', 'אזהרה']);
    if (!row[COL.DATA_OWNER])                             issues.push([rowNum, 'אחראי לא מוגדר', 'אזהרה']);
    if (Number(row[COL.NET_SPEND]) < 0)                   issues.push([rowNum, 'הוצאה שלילית', 'שגיאה']);
  }

  // Write to QA sheet
  qaSheet.clearContents();
  qaSheet.getRange(1, 1, 1, 4).setValues([['שורה', 'בעיה', 'חומרתה', 'תאריך']]);
  if (issues.length > 0) {
    qaSheet.getRange(2, 1, issues.length, 3).setValues(issues);
    qaSheet.getRange(2, 4, issues.length, 1).setValue(new Date());
  }

  SpreadsheetApp.flush();
  ui.alert('✔️ QA הסתיים. נמצאו ' + issues.length + ' בעיות.');
  if (issues.length > 0) ss.setActiveSheet(qaSheet);
}

function generateMonthlyManagementReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const settingsSheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
  const year  = settingsSheet ? settingsSheet.getRange('B2').getValue() : new Date().getFullYear();
  const month = settingsSheet ? settingsSheet.getRange('B3').getValue() : new Date().getMonth() + 1;
  const monthName = HEBREW_MONTHS[month - 1];

  const masterSheet = ss.getSheetByName(SHEET_NAMES.MASTER_INPUT);
  if (!masterSheet) { ui.alert('לא נמצאה לשונית נתונים'); return; }

  const monthKey = year + '-' + String(month).padStart(2, '0');
  const data = masterSheet.getDataRange().getValues();

  let totalSpend = 0, totalLeads = 0, totalMeetings = 0, totalClosings = 0, totalRevenue = 0;
  const channelData = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if ((row[3] || '').toString() !== monthKey) continue;
    const channel  = row[5] || 'לא ידוע';
    const spend    = Number(row[15]) || 0;
    const leads    = Number(row[21]) || 0;
    const meetings = Number(row[26]) || 0;
    const closings = Number(row[28]) || 0;
    const revenue  = Number(row[32]) || 0;

    totalSpend    += spend;
    totalLeads    += leads;
    totalMeetings += meetings;
    totalClosings += closings;
    totalRevenue  += revenue;

    if (!channelData[channel]) channelData[channel] = { spend: 0, leads: 0, meetings: 0, closings: 0 };
    channelData[channel].spend    += spend;
    channelData[channel].leads    += leads;
    channelData[channel].meetings += meetings;
    channelData[channel].closings += closings;
  }

  const roi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend * 100).toFixed(1) + '%' : 'N/A';
  const cpl = totalLeads > 0 ? '₪' + Math.round(totalSpend / totalLeads).toLocaleString() : 'N/A';

  // Create report sheet
  let reportSheet = ss.getSheetByName('📊 דוח ' + monthName + ' ' + year);
  if (reportSheet) ss.deleteSheet(reportSheet);
  reportSheet = ss.insertSheet('📊 דוח ' + monthName + ' ' + year);
  reportSheet.setRightToLeft(true);

  const rows = [
    ['🏠 EXEL Marketing OS — דוח ניהול חודשי', '', monthName + ' ' + year],
    [],
    ['כללים'],
    ['הוצאה כוללת', '₪' + totalSpend.toLocaleString()],
    ['לידים', totalLeads],
    ['פגישות', totalMeetings],
    ['סגירות', totalClosings],
    ['הכנסות', '₪' + totalRevenue.toLocaleString()],
    ['ROI', roi],
    ['CPL', cpl],
    [],
    ['ביצועי ערוצים'],
    ['ערוץ', 'הוצאה', 'לידים', 'פגישות', 'סגירות'],
  ];

  Object.entries(channelData).forEach(([ch, d]) => {
    rows.push([ch, '₪' + (d.spend).toLocaleString(), d.leads, d.meetings, d.closings]);
  });

  reportSheet.getRange(1, 1, rows.length, 5).setValues(rows);
  reportSheet.autoResizeColumns(1, 5);

  SpreadsheetApp.flush();
  ss.setActiveSheet(reportSheet);
  ui.alert('✅ דוח נוצר בהצלחה: “' + reportSheet.getName() + '”');
}

function generateMissingInvoiceReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const masterSheet = ss.getSheetByName(SHEET_NAMES.MASTER_INPUT);
  if (!masterSheet) { ui.alert('לא נמצאה לשונית נתונים'); return; }

  const data    = masterSheet.getDataRange().getValues();
  const missing = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (Number(row[15]) > 0 && row[17] === 'חסרה') {
      missing.push([row[3], row[5], '₪' + Number(row[15]).toLocaleString(), 'חשבונית חסרה']);
    }
  }

  let sheet = ss.getSheetByName('💸 חשבוניות חסרות');
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet('💸 חשבוניות חסרות');
  sheet.setRightToLeft(true);

  sheet.getRange(1, 1, 1, 4).setValues([['מפתח חודש', 'ערוץ', 'הוצאה', 'סטטוס']]);
  if (missing.length > 0) {
    sheet.getRange(2, 1, missing.length, 4).setValues(missing);
  }

  ss.setActiveSheet(sheet);
  ui.alert('✅ נמצאו ' + missing.length + ' רשומות עם חשבוניות חסרות.');
}

function exportDashboardPdf() {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const ui  = SpreadsheetApp.getUi();
  const sheet = ss.getSheetByName(SHEET_NAMES.CONTROL_CENTER);
  if (!sheet) { ui.alert('לא נמצאה לשונית מרכז פיקוד'); return; }

  const url = 'https://docs.google.com/spreadsheets/d/' + ss.getId() +
              '/export?format=pdf&gid=' + sheet.getSheetId() +
              '&size=A4&portrait=false&fitw=true&sheetnames=false&gridlines=false';

  const blob    = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() } }).getBlob();
  const folder  = DriveApp.getRootFolder();
  const pdfFile = folder.createFile(blob.setName('EXEL_Dashboard_' + new Date().toISOString().slice(0,10) + '.pdf'));

  ui.alert('✅ PDF נשמר: ' + pdfFile.getName() + '\nקישור: ' + pdfFile.getUrl());
}

function createMonthlyDriveFolder() {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const ui  = SpreadsheetApp.getUi();

  const settingsSheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
  const year  = settingsSheet ? settingsSheet.getRange('B2').getValue() : new Date().getFullYear();
  const month = settingsSheet ? settingsSheet.getRange('B3').getValue() : new Date().getMonth() + 1;
  const monthName = HEBREW_MONTHS[month - 1];

  const rootName   = 'EXEL Marketing OS';
  const yearName   = String(year);
  const monthName2 = String(month).padStart(2, '0') + '_' + monthName;

  let rootFolder = null;
  const roots = DriveApp.getFoldersByName(rootName);
  rootFolder = roots.hasNext() ? roots.next() : DriveApp.createFolder(rootName);

  let yearFolder = null;
  const years = rootFolder.getFoldersByName(yearName);
  yearFolder = years.hasNext() ? years.next() : rootFolder.createFolder(yearName);

  let monthFolder = null;
  const months = yearFolder.getFoldersByName(monthName2);
  monthFolder = months.hasNext() ? months.next() : yearFolder.createFolder(monthName2);

  ['Invoices', 'Reports', 'Campaign Exports'].forEach(sub => {
    const subs = monthFolder.getFoldersByName(sub);
    if (!subs.hasNext()) monthFolder.createFolder(sub);
  });

  ui.alert('✅ תיקייה נוצרה:\n' + rootName + ' / ' + yearName + ' / ' + monthName2 + '\n\nקישור: ' + monthFolder.getUrl());
}

function protectFormulaColumns() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const sheets = [
    ss.getSheetByName(SHEET_NAMES.CONTROL_CENTER),
    ss.getSheetByName(SHEET_NAMES.CHANNEL_DASHBOARD),
    ss.getSheetByName(SHEET_NAMES.FUNNEL_DASHBOARD),
  ].filter(Boolean);

  sheets.forEach(sheet => {
    const protection = sheet.protect();
    protection.setDescription('נוסחאות מוגנות על ידי EXEL Marketing OS');
    const me = Session.getEffectiveUser();
    protection.addEditor(me);
    protection.removeEditors(protection.getEditors());
    if (protection.canDomainEdit()) protection.setDomainEdit(false);
  });

  ui.alert('✅ הגנה הופעלה על דפי הדשבורדים');
}

function openSetupGuide() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const guide = ss.getSheetByName(SHEET_NAMES.SETUP_GUIDE);
  if (guide) { ss.setActiveSheet(guide); }
  else { SpreadsheetApp.getUi().alert('לא נמצאה לשונית מדריך. בדוק שקיימת לשונית "13_מדריך".'); }
}

// ─── TRIGGER ──────────────────────────────────────────────────────────────────
function timestampEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  if (sheet.getName() !== SHEET_NAMES.MASTER_INPUT) return;

  const lastUpdateCol = 40; // Adjust to your actual column
  const updatedByCol  = 41;

  sheet.getRange(range.getRow(), lastUpdateCol).setValue(new Date());
  sheet.getRange(range.getRow(), updatedByCol).setValue(Session.getActiveUser().getEmail());
}

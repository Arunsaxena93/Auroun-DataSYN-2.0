"""
=========================================================
AUROUN DATASYN 2.0
Flask Backend
Author : Arun Kumar Saxena
Company : Auroun DataSYN
=========================================================
"""


import matplotlib
matplotlib.use("Agg")

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    Table,
    TableStyle,
    Image
)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import inch
from flask import send_file
import matplotlib.pyplot as plt
import numpy as np
import os
import json
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename

from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    flash
)

# =========================================================
# FLASK CONFIGURATION
# =========================================================

app = Flask(__name__)

app.secret_key = "auroun_datasyn_secret_key_2026"

UPLOAD_FOLDER = "uploads"
DATA_FOLDER = "data"

CONTACT_FILE = os.path.join(DATA_FOLDER, "contacts.json")
APPLICATION_FILE = os.path.join(DATA_FOLDER, "applications.json")

ALLOWED_EXTENSIONS = {
    "pdf",
    "doc",
    "docx"
}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

# =========================================================
# CREATE REQUIRED FOLDERS
# =========================================================

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(DATA_FOLDER, exist_ok=True)

if not os.path.exists(CONTACT_FILE):
    with open(CONTACT_FILE, "w") as f:
        json.dump([], f, indent=4)

if not os.path.exists(APPLICATION_FILE):
    with open(APPLICATION_FILE, "w") as f:
        json.dump([], f, indent=4)

# =========================================================
# HELPER FUNCTIONS
# =========================================================

def allowed_file(filename):

    return (
        "." in filename and
        filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def load_json(file_path):

    try:

        with open(file_path, "r") as f:

            return json.load(f)

    except Exception:

        return []


def save_json(file_path, data):

    with open(file_path, "w") as f:

        json.dump(data, f, indent=4)


def generate_application_id():

    applications = load_json(APPLICATION_FILE)

    count = len(applications) + 1

    return f"ADS-2026-{count:06d}"


def current_date():

    return datetime.now().strftime("%d-%m-%Y")


def current_time():

    return datetime.now().strftime("%I:%M %p")

# =========================================================
# WEBSITE ROUTES
# =========================================================

@app.route("/")
def home():

    return render_template("index.html")


@app.route("/about")
def about():

    return render_template("about.html")


@app.route("/services")
def services():

    return render_template("services.html")


@app.route("/careers")
def careers():

    jobs = [

        "Python Developer",

        "Data Analyst",

        "Business Analyst",

        "AI / ML Engineer",

        "Full Stack Developer"

    ]

    return render_template(
        "careers.html",
        jobs=jobs
    )


@app.route("/contact")
def contact():

    return render_template("contact.html")


@app.route("/subscription")
def subscription():

    return render_template("subscription.html")


# =========================================================
# DASHBOARD
# =========================================================

@app.route("/dashboard")
def dashboard():

    contacts = load_json(CONTACT_FILE)
    applications = load_json(APPLICATION_FILE)

    dashboard_data = {

        "projects": 12,
        "clients": 35,
        "revenue": "₹0",
        "accuracy": "99%",
        "contacts": len(contacts),
        "applications": len(applications)

    }

    return render_template(
        "dashboard.html",
        dashboard=dashboard_data,
        contacts=contacts[-5:],
        applications=applications[-5:]
    )
    
    # =========================================================
# AI CHATBOT
# =========================================================

@app.route("/chatbot")
def chatbot():

    return render_template(
        "chatbot.html",
        filename=request.args.get("filename","Dataset"),
        rows=request.args.get("rows",0),
        columns=request.args.get("columns",0),
        numeric_columns=request.args.get("numeric_columns",0),
        missing_values=request.args.get("missing_values",0),
        duplicate_rows=request.args.get("duplicate_rows",0)
    )

# =========================================================
# APPLY PAGE
# =========================================================

@app.route("/apply/<position>")
def apply(position):

    return render_template(
        "apply.html",
        position=position
    )


# =========================================================
# CONTACT FORM
# =========================================================

@app.route("/submit_contact", methods=["POST"])
def submit_contact():

    contacts = load_json(CONTACT_FILE)

    enquiry = {

        "id": str(uuid.uuid4())[:8].upper(),

        "fullname": request.form.get("fullname"),

        "email": request.form.get("email"),

        "phone": request.form.get("phone"),

        "company": request.form.get("company"),

        "service": request.form.get("service"),

        "budget": request.form.get("budget"),

        "message": request.form.get("message"),

        "date": current_date(),

        "time": current_time(),

        "status": "New"

    }

    contacts.append(enquiry)

    save_json(CONTACT_FILE, contacts)

    flash(
        "Your enquiry has been submitted successfully.",
        "success"
    )

    return redirect(url_for("contact"))


# =========================================================
# JOB APPLICATION
# =========================================================

@app.route("/submit_application", methods=["POST"])
def submit_application():

    if "resume" not in request.files:

        flash("Resume is required.", "danger")

        return redirect(request.referrer)

    resume = request.files["resume"]

    if resume.filename == "":

        flash("Please choose a resume.", "danger")

        return redirect(request.referrer)

    if not allowed_file(resume.filename):

        flash(
            "Only PDF, DOC and DOCX files are allowed.",
            "danger"
        )

        return redirect(request.referrer)

    application_id = generate_application_id()

    extension = resume.filename.rsplit(".", 1)[1].lower()

    filename = secure_filename(

        f"{application_id}.{extension}"

    )

    resume.save(

        os.path.join(
            app.config["UPLOAD_FOLDER"],
            filename
        )

    )

    applications = load_json(APPLICATION_FILE)

    application = {

        "application_id": application_id,

        "position": request.form.get("position"),

        "fullname": request.form.get("fullname"),

        "email": request.form.get("email"),

        "phone": request.form.get("phone"),

        "experience": request.form.get("experience"),

        "education": request.form.get("education"),

        "skills": request.form.get("skills"),

        "cover_letter": request.form.get("cover_letter"),

        "resume": filename,

        "date": current_date(),

        "time": current_time(),

        "status": "Application Received"

    }

    applications.append(application)

    save_json(
        APPLICATION_FILE,
        applications
    )

    return render_template(

        "application_success.html",

        application_id=application_id,

        position=application["position"],

        submission_date=application["date"],

        submission_time=application["time"]

    )
    # =========================================================
# DOWNLOAD RESUME
# =========================================================

from flask import send_from_directory


@app.route("/resume/<filename>")
def download_resume(filename):

    return send_from_directory(

        app.config["UPLOAD_FOLDER"],

        filename,

        as_attachment=True

    )


# =========================================================
# API (Future Ready)
# =========================================================

@app.route("/api/dashboard")
def dashboard_api():

    contacts = load_json(CONTACT_FILE)

    applications = load_json(APPLICATION_FILE)

    return {

        "projects": 12,

        "clients": 35,

        "contacts": len(contacts),

        "applications": len(applications),

        "revenue": "₹0",

        "accuracy": "99%"

    }


# =========================================================
# ERROR HANDLERS
# =========================================================

@app.errorhandler(404)
def page_not_found(error):
 return "404 - Page Not Found", 404


@app.errorhandler(500)
def internal_server(error):
 return "500 - Internal Server Error", 500


# =========================================================
# BEFORE REQUEST
# =========================================================

@app.before_request
def before_request():

    """
    Reserved for:

    Authentication

    Logging

    Database Session

    Security Checks

    """

    pass


# =========================================================
# AFTER REQUEST
# =========================================================

@app.after_request
def after_request(response):

    response.headers[

        "X-Frame-Options"

    ] = "SAMEORIGIN"

    response.headers[

        "X-Content-Type-Options"

    ] = "nosniff"

    response.headers[

        "Cache-Control"

    ] = "no-store"

    return response


# =========================================================
# FUTURE DATABASE PLACEHOLDER
# =========================================================

class Database:

    """
    Future Upgrade:

    SQLite

    PostgreSQL

    MySQL

    MongoDB

    """

    pass


# =========================================================
# MAIN
# =========================================================

# ==========================================================
# DATASET UPLOAD
# ==========================================================

import os
import pandas as pd
from flask import request, flash, redirect

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/upload", methods=["POST"])
def upload_dataset():

    if "dataset" not in request.files:
        flash("No file selected.")
        return redirect("/dashboard")

    file = request.files["dataset"]

    if file.filename == "":
        flash("Please choose a dataset.")
        return redirect("/dashboard")

    filepath = os.path.join(
        app.config["UPLOAD_FOLDER"],
        file.filename
    )

    file.save(filepath)

    extension = file.filename.rsplit(".", 1)[1].lower()

    try:

        if extension == "csv":
            df = pd.read_csv(filepath)

        elif extension == "xlsx":
            df = pd.read_excel(filepath)

        elif extension == "json":
            df = pd.read_json(filepath)

        else:
            flash("Unsupported dataset format.")
            return redirect("/dashboard")

    except Exception as e:

        flash(f"Dataset Error : {e}")
        return redirect("/dashboard")

    rows = len(df)
    columns = len(df.columns)

    preview = df.head(10).to_html(
        classes="table table-striped table-hover",
        index=False
    )

    summary = df.describe(include="all").fillna("").to_html(
        classes="table table-striped table-hover",
        index=True
    )

    missing_values = int(df.isnull().sum().sum())

    duplicate_rows = int(df.duplicated().sum())

    numeric_df = df.select_dtypes(include=np.number)

    numeric_columns = len(numeric_df.columns)
# ===============================
# AI DATASET SCORE
# ===============================

    score = 100

    score -= min(missing_values * 2, 30)
    score -= min(duplicate_rows * 3, 20)

    if columns == 0:
      score = 0

      score = max(score, 0)
    os.makedirs("static/charts", exist_ok=True)

    histogram_chart = None
    bar_chart = None
    pie_chart = None
    line_chart = None
    scatter_chart = None
    column_chart = None

    # ==========================================================
    # HISTOGRAM
    # ==========================================================

    if not numeric_df.empty:

        first_col = numeric_df.columns[0]

        plt.figure(figsize=(8,4))

        numeric_df[first_col].plot(
            kind="hist",
            bins=15,
            title=f"{first_col} Histogram"
        )

        histogram_name = f"{uuid.uuid4().hex}.png"

        plt.grid(True)

        plt.savefig(
            os.path.join("static/charts", histogram_name),
            bbox_inches="tight"
        )

        plt.close()

        histogram_chart = f"charts/{histogram_name}"


    # ==========================================================
    # BAR CHART
    # ==========================================================

    if not numeric_df.empty:

        plt.figure(figsize=(8,4))

        numeric_df[first_col].head(10).plot(
            kind="bar",
            title=f"{first_col} Bar Chart"
        )

        plt.grid(True)

        bar_name = f"{uuid.uuid4().hex}.png"

        plt.savefig(
            os.path.join("static/charts", bar_name),
            bbox_inches="tight"
        )

        plt.close()

        bar_chart = f"charts/{bar_name}"


    # ==========================================================
    # PIE CHART
    # ==========================================================

    if not numeric_df.empty:

        plt.figure(figsize=(6,6))

        numeric_df[first_col].head(5).plot(
            kind="pie",
            autopct="%1.1f%%"
        )

        plt.ylabel("")

        plt.title(f"{first_col} Pie Chart")

        pie_name = f"{uuid.uuid4().hex}.png"

        plt.savefig(
            os.path.join("static/charts", pie_name),
            bbox_inches="tight"
        )

        plt.close()

        pie_chart = f"charts/{pie_name}"


    # ==========================================================
    # LINE CHART
    # ==========================================================

    if not numeric_df.empty:

        plt.figure(figsize=(8,4))

        numeric_df[first_col].head(30).plot(
            kind="line",
            marker="o"
        )

        plt.title(f"{first_col} Line Chart")

        plt.grid(True)

        line_name = f"{uuid.uuid4().hex}.png"

        plt.savefig(
            os.path.join("static/charts", line_name),
            bbox_inches="tight"
        )

        plt.close()

        line_chart = f"charts/{line_name}"


    # ==========================================================
    # SCATTER CHART
    # ==========================================================

    if len(numeric_df.columns) >= 2:

        x = numeric_df.columns[0]
        y = numeric_df.columns[1]

        plt.figure(figsize=(8,4))

        plt.scatter(
            numeric_df[x],
            numeric_df[y]
        )

        plt.xlabel(x)
        plt.ylabel(y)

        plt.title("Scatter Chart")

        scatter_name = f"{uuid.uuid4().hex}.png"

        plt.grid(True)

        plt.savefig(
            os.path.join("static/charts", scatter_name),
            bbox_inches="tight"
        )

        plt.close()

        scatter_chart = f"charts/{scatter_name}"


    # ==========================================================
    # COLUMN CHART
    # ==========================================================

    if not numeric_df.empty:

        plt.figure(figsize=(8,4))

        numeric_df[first_col].head(10).plot(
            kind="bar"
        )

        plt.title(f"{first_col} Column Chart")

        column_name = f"{uuid.uuid4().hex}.png"

        plt.grid(True)

        plt.savefig(
            os.path.join("static/charts", column_name),
            bbox_inches="tight"
        )

        plt.close()

        column_chart = f"charts/{column_name}"
        
        return render_template(
    "result.html",
    uploaded=True,
    filename=file.filename,
    rows=rows,
    columns=columns,
    preview=preview,
    summary=summary,
    missing_values=missing_values,
    duplicate_rows=duplicate_rows,
    numeric_columns=numeric_columns,
    ai_score=score,
    histogram_chart=histogram_chart,
    bar_chart=bar_chart,
    pie_chart=pie_chart,
    line_chart=line_chart,
    scatter_chart=scatter_chart,
    column_chart=column_chart
)
        
@app.route("/download_report")
def download_report():

    filename = request.args.get("filename", "Dataset")
    rows = request.args.get("rows", "0")
    columns = request.args.get("columns", "0")
    numeric = request.args.get("numeric_columns", "0")
    missing = request.args.get("missing_values", "0")
    duplicate = request.args.get("duplicate_rows", "0")
    score = int(request.args.get("ai_score", "0"))

    pdf_name = "Auroun_DataSYN_Report.pdf"

    doc = SimpleDocTemplate(
        pdf_name,
        rightMargin=30,
        leftMargin=30,
        topMargin=30,
        bottomMargin=30
    )

    styles = getSampleStyleSheet()

    title = styles["Title"]
    title.alignment = TA_CENTER

    heading = styles["Heading2"]
    heading.alignment = TA_CENTER

    normal = styles["BodyText"]

    story = []
# ======================================================
# COVER PAGE
# ======================================================

    story.append(Spacer(1, 40))

    story.append(Paragraph(
    "<font size='28'><b>AUROUN DATASYN 2.0</b></font>",
    title
))

    story.append(Spacer(1, 15))

    story.append(Paragraph(
    "<font size='18'>Artificial Intelligence Dataset Analysis Report</font>",
    heading
))

    story.append(Spacer(1, 60))

    story.append(Paragraph(
    "<font size='16'><b>Prepared By</b></font>",
    heading
))

    story.append(Paragraph(
    "Auroun DataSYN AI Engine",
    normal
))

    story.append(Spacer(1, 40))

    story.append(Paragraph(
    "<b>Chief Managing Director</b>",
    heading
))

    story.append(Paragraph(
    "Arun Kumar Saxena",
    normal
))

    story.append(Spacer(1, 80))

    story.append(Paragraph(
    datetime.now().strftime("%d %B %Y"),
    normal
))

    story.append(PageBreak())

    story.append(
        Paragraph(
            "<font size='24'><b>AUROUN DATASYN 2.0</b></font>",
            title
        )
    )

    story.append(
        Paragraph(
            "<font size='15'>Artificial Intelligence Dataset Analysis Report</font>",
            heading
        )
    )

    story.append(Spacer(1, 20))

    info = Table([
        ["Company", "Auroun DataSYN 2.0"],
        ["Chief Managing Director", "Arun Kumar Saxena"],
        ["Generated On", datetime.now().strftime("%d-%m-%Y %I:%M %p")]
    ], colWidths=[180, 280])

    info.setStyle(TableStyle([
        ("GRID",(0,0),(-1,-1),1,colors.grey),
        ("BACKGROUND",(0,0),(0,-1),colors.HexColor("#EAF4FF")),
        ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),
        ("BOTTOMPADDING",(0,0),(-1,-1),8)
    ]))

    story.append(info)

    story.append(Spacer(1,20))
    dataset_table = Table([
        ["Property", "Value"],
        ["Dataset Name", filename],
        ["Total Rows", str(rows)],
        ["Total Columns", str(columns)],
        ["Numeric Columns", str(numeric)],
        ["Missing Values", str(missing)],
        ["Duplicate Rows", str(duplicate)],
        ["AI Dataset Score", f"{score}%"]
    ], colWidths=[220,220])

    dataset_table.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),colors.HexColor("#0F172A")),
        ("TEXTCOLOR",(0,0),(-1,0),colors.white),
        ("GRID",(0,0),(-1,-1),1,colors.grey),
        ("BACKGROUND",(0,1),(0,-1),colors.HexColor("#EAF4FF")),
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
        ("FONTNAME",(0,1),(0,-1),"Helvetica-Bold"),
        ("BOTTOMPADDING",(0,0),(-1,0),10)
    ]))

    story.append(dataset_table)

    story.append(Spacer(1,25))

    story.append(Paragraph("AI Recommendation", heading))

    if score >= 90:
        recommendation = (
            "Excellent dataset quality.<br/>"
            "Ready for Machine Learning.<br/>"
            "Ready for Business Intelligence.<br/>"
            "Ready for Production Analytics."
        )
    elif score >= 70:
        recommendation = (
            "Good dataset quality.<br/>"
            "Minor preprocessing is recommended."
        )
    else:
        recommendation = (
            "Dataset quality is low.<br/>"
            "Please clean missing values and duplicate rows."
        )

    story.append(Paragraph(recommendation, normal))

    story.append(Spacer(1,30))

    story.append(
        Paragraph(
            "<b>Generated by Auroun DataSYN 2.0 AI Engine</b>",
            heading
        )
    )

    story.append(
        Paragraph(
            "© 2026 Auroun DataSYN | Chief Managing Director : Arun Kumar Saxena",
            normal
        )
    )

    doc.build(story)

    return send_file(
        pdf_name,
        as_attachment=True
    )


    
if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )

from matplotlib import style
style.use('fivethirtyeight')
import matplotlib.pyplot as plt

import numpy as np
import pandas as pd
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect

# from flask import Flask, jsonify
from flask import render_template
from flask_cors import CORS
from flask import Flask, jsonify, make_response


#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///Resources/project.sqlite")

# reflect an existing database into a new model

Base = automap_base()
Base.prepare(autoload_with=engine)


# reflect the tables
Base.classes.keys()

# Create the inspector and connect it to the engine
inspector = inspect(engine)

# Collect the names of tables within the database
inspector.get_table_names()


# Save references to each table

# Map RMIS class
RMIS = Base.classes.RMIS

# Map QLD_IRA class
QLD_IRA = Base.classes.QLD_IRA

# Map QLD_Reg_AR class
QLD_Reg_AR = Base.classes.QLD_Reg_AR

# Map QLD_SRS class
QLD_SRS_AR = Base.classes.QLD_SRS

# Map SA_Reg class
SA_Reg = Base.classes.SA_Reg

# Map WA_RS_Reg class
WA_RS_Reg = Base.classes.WA_RS_Reg

# Map WA_RX_Reg class
WA_RX_Reg = Base.classes.WA_RX_Reg


#################################################
# Functions to check dates for queries
#################################################

def check_date (argument):

    date_list = argument.split('-')

    if len (date_list)==3:

        try:

            year = int(date_list[0])

            month = int(date_list[1])

            day = int(date_list[2])

            query_date = dt.date(year, month,day)

            return (query_date)
        
        except:


            return (False)
        
    else:
        
        return (False)



#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"<head>"
        f"<title>Project 03 - LCard</title>" 
        f"</head>"
        f"<h1>Project 03</h1>" 
        f"<h2>Available Routes:</h2><br/>"
        f"<br/>"
        f"<ol>"
        f"<li>To get the Jsonified Photo Inventory Compliance data :<br/>"
        f"<strong>  /api/v1.0/photocomp </strong></li><br/>"
        f"<br/>"
        f"<li>To get the Jsonified Leak Test Compliance data :<br/>"
        f" <strong> /api/v1.0/leaktestcomp</strong></li><br/>"
        f"<br/>"
        f"<li>To get the Jsonified Calibration Compliance data :<br/>"
        f" <strong> /api/v1.0/calcomp</strong></li><br/>"
        f"<br/>"

    )




@app.route("/api/v1.0/photocomp")
def photocomp():
    # Create our session (link) from Python to the DB
    session = Session(engine)


    PhotoComp = session.query(RMIS.Geounit, RMIS.Country, RMIS.FacilityNamewithFacilityID, RMIS.BusinessLine, RMIS.ConfirmationPhotoComplianceIndicator, func.count(RMIS.ConfirmationPhotoComplianceIndicator)).\
                group_by(RMIS.FacilityNamewithFacilityID).\
                group_by(RMIS.BusinessLine).\
                group_by(RMIS.ConfirmationPhotoComplianceIndicator).\
                all()
    
    session.close()

    PhotoComp_data_out = []

    for row in PhotoComp:
        PhotoComp_dict = {}
        PhotoComp_dict["Geounit"]=row.Geounit
        PhotoComp_dict["Country"]=row.Country
        PhotoComp_dict["CompType"]="PhotoComp"       
        PhotoComp_dict["FacilityNamewithFacilityID"]=row.FacilityNamewithFacilityID
        PhotoComp_dict["BusinessLine"]=row.BusinessLine
        PhotoComp_dict["ComplianceIndicator"]=row.ConfirmationPhotoComplianceIndicator
        PhotoComp_dict["Count"]=row[5]
        PhotoComp_dict["lat"]= getlat(row.Country)
        PhotoComp_dict["lon"]= getlon(row.Country)


        PhotoComp_data_out.append(PhotoComp_dict)


    response = make_response(jsonify(PhotoComp_data_out))
    
    response.headers["Access-Control-Allow-Origin"]="*"
    
    return response
    




@app.route("/api/v1.0/leaktestcomp")
def leaktestcomp():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    LeakTestComp = session.query(RMIS.Geounit, RMIS.Country,RMIS.FacilityNamewithFacilityID, RMIS.BusinessLine, RMIS.LeakTestComplianceIndicator, func.count(RMIS.LeakTestComplianceIndicator)).\
    		group_by(RMIS.FacilityNamewithFacilityID).\
    		group_by(RMIS.BusinessLine).\
    		group_by(RMIS.LeakTestComplianceIndicator).\
    		all()
    
    session.close()

    LeakTestComp_data_out = []

    for row in LeakTestComp:
        LeakTestComp_dict = {}
        LeakTestComp_dict["Geounit"]=row.Geounit
        LeakTestComp_dict["Country"]=row.Country
        LeakTestComp_dict["CompType"]="LeakTestComp"   
        LeakTestComp_dict["FacilityNamewithFacilityID"]=row.FacilityNamewithFacilityID
        LeakTestComp_dict["BusinessLine"]=row.BusinessLine
        LeakTestComp_dict["ComplianceIndicator"]=row.LeakTestComplianceIndicator
        LeakTestComp_dict["Count"]=row[5]
        LeakTestComp_dict["lat"]= getlat(row.Country)
        LeakTestComp_dict["lon"]= getlon(row.Country)

        LeakTestComp_data_out.append(LeakTestComp_dict)


    response = make_response(jsonify(LeakTestComp_data_out))
    
    response.headers["Access-Control-Allow-Origin"]="*"
    
    return response





@app.route("/api/v1.0/calcomp")
def calcomp():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    CalibrationComp = session.query(RMIS.Geounit, RMIS.Country,RMIS.FacilityNamewithFacilityID, RMIS.BusinessLine, RMIS.CalibrationComplianceIndicator, func.count(RMIS.CalibrationComplianceIndicator)).\
    		group_by(RMIS.FacilityNamewithFacilityID).\
    		group_by(RMIS.BusinessLine).\
    		group_by(RMIS.CalibrationComplianceIndicator).\
    		all()
    
    session.close()

    CalibrationComp_data_out = []

    for row in CalibrationComp:
        CalibrationComp_dict = {}
        CalibrationComp_dict["Geounit"]=row.Geounit
        CalibrationComp_dict["Country"]=row.Country
        CalibrationComp_dict["CompType"]="CalibrationComp"   
        CalibrationComp_dict["FacilityNamewithFacilityID"]=row.FacilityNamewithFacilityID
        CalibrationComp_dict["BusinessLine"]=row.BusinessLine
        CalibrationComp_dict["ComplianceIndicator"]=row.CalibrationComplianceIndicator
        CalibrationComp_dict["Count"]=row[5]
        CalibrationComp_dict["lat"]= getlat(row.Country)
        CalibrationComp_dict["lon"]= getlon(row.Country)

        CalibrationComp_data_out.append(CalibrationComp_dict)
        
    response = make_response(jsonify(CalibrationComp_data_out))
    
    response.headers["Access-Control-Allow-Origin"]="*"
    
    return response



def getlat(country):

  ChinaCoord = [35.8617 , 104.1954 ]
  IndonesiaCoord = [-0.7893, 113.9213]
  AustraliaCoord = [-25.2744 , 133.7751]
  JapanCoord = [36.2048 , 138.2529]
  NZCoord = [-40.9006, 174.8860]
  PNGCoord = [-6, 148]
  TaiwanCoord = [23.6978, 120.9605]

  if (country == 'China'):
    return ChinaCoord[0]
  
  if (country == 'Indonesia'):
    return IndonesiaCoord[0]
  
  if (country == 'Australia'):
    return AustraliaCoord[0]
 
  if (country == 'Japan'):
    return JapanCoord[0]
  
  if (country == 'New Zealand'):
    return NZCoord[0]
  
  if (country == 'Papua New Guinea'):
    return PNGCoord[0]

  if (country == 'Taiwan, Province Of China'):
    return TaiwanCoord[0]



def getlon(country):

  ChinaCoord = [35.8617 , 104.1954 ]
  IndonesiaCoord = [-0.7893, 113.9213]
  AustraliaCoord = [-25.2744 , 133.7751]
  JapanCoord = [36.2048 , 138.2529]
  NZCoord = [-40.9006, 174.8860]
  PNGCoord = [-6, 148]
  TaiwanCoord = [23.6978, 120.9605]

  if (country == 'China'):
    return ChinaCoord[1]
  
  if (country == 'Indonesia'):
    return IndonesiaCoord[1]
  
  if (country == 'Australia'):
    return AustraliaCoord[1]
 
  if (country == 'Japan'):
    return JapanCoord[1]
  
  if (country == 'New Zealand'):
    return NZCoord[1]
  
  if (country == 'Papua New Guinea'):
    return PNGCoord[1]

  if (country == 'Taiwan, Province Of China'):
    return TaiwanCoord[1]



if __name__ == '__main__':
    app.run(debug=True)

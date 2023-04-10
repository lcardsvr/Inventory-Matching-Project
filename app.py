
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
        # f'<img src="https://static.bc-edx.com/data/dla-1-2/m10/lms/img/surfs-up.jpg" alt=""/>'
        # f"<br/>"
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
        # f"<li> Min, max, and average temperatures calculated from the given start date to the end of the dataset. Input format must be numbers separated by a hyphen following Year-MM-DD format:<br/>"
        # f"<strong>  /api/v1.0/Year-MM-DD</strong></li><br/>"
        # f"<br/>"
        # f"<li>Min, max, and average temperatures calculated from the given start date to the given end date. Input format must be numbers separated by a hyphen following Year-MM-DD format:<br/>"
        # f"<strong> /api/v1.0/Year-MM-DD/Year-MM-DD</strong></li><br/>"
        # f"</ol>"
        # f"<strong>For the queries data is available between 2010-01-01 and 2017-08-23</strong>"
        
    )


# @app.route("/")
# def home():
#     # people = Person.query.all()

#     PhotoComp =photocomp()
#     LeakTestComp = leaktestcomp()
#     CalibrationComp = calcomp()
#     return render_template("index.html", PhotoComp,LeakTestComp,CalibrationComp )


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


        PhotoComp_data_out.append(PhotoComp_dict)


    response = make_response(jsonify(PhotoComp_data_out))
    
    response.headers["Access-Control-Allow-Origin"]="*"
    
    return response
    
    # return jsonify(PhotoComp_data_out)



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

        LeakTestComp_data_out.append(LeakTestComp_dict)


    response = make_response(jsonify(LeakTestComp_data_out))
    
    response.headers["Access-Control-Allow-Origin"]="*"
    
    return response

    # return jsonify(LeakTestComp_data_out)



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

        CalibrationComp_data_out.append(CalibrationComp_dict)
        
    response = make_response(jsonify(CalibrationComp_data_out))
    
    response.headers["Access-Control-Allow-Origin"]="*"
    
    return response

    # return jsonify(CalibrationComp_data_out)



# @app.route("/api/v1.0/stations")
# def stations():
#     # Create our session (link) from Python to the DB
#     session = Session(engine)

#     # stations_grp= session.query(Measurement).group_by(Measurement.station).order_by(func.co).all()


#     # stations_grp= session.query(Measurement,Station).\
#     #     group_by(Measurement.station).\
#     #     order_by(func.count(Measurement.station).desc()).\
#     #     filter(Measurement.station == Station.station ).all()
    
#     # stations_grp= session.query(Station).\
#     # group_by(Station.station).all()

#     stations_grp= session.query(Station).\
#     group_by(Station.station).all()

#     session.close()

#     # Create a dictionary from the row data and append to a list of all_passengers
#     stations = []
#     st =len(stations_grp)

#     i=0 

#     for row in stations_grp:
#         station_dict = {}
#         station_dict[f"Station {i+1}"] = row.station
#         station_dict["Name"] = row.name
#         station_dict["Latitude"] = row.latitude
#         station_dict["Longitude"] = row.longitude
#         station_dict["Elevation"] = row.elevation
#         stations.append(station_dict)
#         i = i+1

#     return jsonify(stations)


# @app.route("/api/v1.0/tobs")
# def tobs():
#     # Create our session (link) from Python to the DB
#     session = Session(engine)

#     query_date2 = dt.date(2017, 8,18 ) - dt.timedelta(days=365)
#     print("Query Date: ", query_date2)

#     temp_data = session.query(Measurement.date, Measurement.tobs).\
#      filter(Measurement.date >= query_date2).\
#      filter(Measurement.station == 'USC00519281' ).\
#      order_by(Measurement.date).all()
    
#     session.close()
    
#     temp_data_out = []

#     for date, tobs in temp_data:
#         temp_dict = {}
#         temp_dict["date"]=date
#         temp_dict["tobs"]=tobs
#         temp_data_out.append(temp_dict)

#     return jsonify(temp_data_out)

    


# @app.route("/api/v1.0/<start>")
# def start_only(start):

   
#     start_date = check_date (start)

#     if start_date != False:
       
#        if start_date < dt.date(2010,1,1) or start_date > dt.date(2017,8,23):
           
#            return jsonify({"error": f"{start} is outside the available data. Data is available between 2010-01-01 and 2017-08-23 "}), 404
       
#        else:
           
#            query_date = start_date

#     else:

#         return jsonify({"error": f"{start} is not a valid date. Data is available between 2010-01-01 and 2017-08-23. Please check and try again"}), 404


#     # query_date = dt.date(year, month,day)    

#     # Create our session (link) from Python to the DB
#     session = Session(engine)

#     query_res = session.query(func.min(Measurement.tobs),func.max(Measurement.tobs),func.avg(Measurement.tobs)).\
#     filter(Measurement.date >= query_date).all()

#     session.close()


#     temp_dict = {}

#     temp_dict["Minimum Temperature - degC"] = query_res[0][0]
#     temp_dict["Maximum Temperature - degC"] = query_res[0][1]
#     temp_dict["Average Temperature - degC"] = query_res[0][2]


#     return jsonify(temp_dict)


# @app.route("/api/v1.0/<start>/<end>")
# def all (start,end):


#     start_date = check_date (start)

#     end_date = check_date (end)


#     if start_date == False or end_date == False:
       
#        return jsonify({"error": f"{start} is not a valid date. Data is available between 2010-01-01 and 2017-08-23. Please check and try again"}), 404
    
       
#     elif start_date < dt.date(2010,1,1) or start_date > dt.date(2017,8,23):
           
#            return jsonify({"error": f"{start} is outside the available data. Data is available between 2010-01-01 and 2017-08-23 "}), 404
    
#     elif end_date < dt.date(2010,1,1) or end_date > dt.date(2017,8,23):
           
#            return jsonify({"error": f"{end} is outside the available data. Data is available between 2010-01-01 and 2017-08-23 "}), 404

#     elif end_date<start_date:

#         return jsonify({"error": f"{end} is greater than {start}. Data is available between 2010-01-01 and 2017-08-23. Please check and try again"}), 404
       

#     try: 
#         delta = end_date - start_date
        
#         query_date = start_date + delta

#     except:

#         return jsonify({"error": f"Unexpected error: Start date: {start} / End date: {end}. Data is available between 2010-01-01 and 2017-08-23. Please check and try again."}), 404


 
#     # Create our session (link) from Python to the DB
#     session = Session(engine)

#     query_res = session.query(func.min(Measurement.tobs),func.max(Measurement.tobs),func.avg(Measurement.tobs)).\
#     filter(Measurement.date >= start_date).\
#     filter(Measurement.date <= end_date).all()

#     session.close()


#     temp_dict = {}

#     temp_dict["Minimum Temperature - degC"] = query_res[0][0]
#     temp_dict["Maximum Temperature - degC"] = query_res[0][1]
#     temp_dict["Average Temperature - degC"] = query_res[0][2]


#     return jsonify(temp_dict)



if __name__ == '__main__':
    app.run(debug=True)

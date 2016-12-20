﻿using GMRS_Proj.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GMRS_Proj.Controllers
{
    public class GmrsController : ApiController
    {    
        //get category descriptions
        [Route("api/gmrs/categories/{catName}")]
        public IHttpActionResult getCategoriesDesc(string catName)
        {
            IEnumerable<Category> res;

            using (var db = new GMRSDBEntities())
            {
                try
                {
                    db.Configuration.ProxyCreationEnabled = false;
                    var data = (from DataCategory in db.DataCategory
                                where
                                  DataCategory.Category.CategoryName == catName
                                select new
                                {
                                    DataCategory.CategoryDesc
                                }).Distinct().ToList();
                    return Ok(data);
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }

        //get value type descriptions
        [Route("api/gmrs/valtype/{valtypename}")]
        public IHttpActionResult getValTypeDesc(string valtypename)
        {
            using (var db = new GMRSDBEntities())
            {
                try
                {
                    db.Configuration.ProxyCreationEnabled = false;
                    var valTypesDesc = (from ValueType in db.ValueType
                                        where
                                          ValueType.ValueTypeName == valtypename
                                        select new
                                        {
                                            ValueType.ValueTypeID,
                                            ValueType.ValueTypeDesc
                                        }).Distinct().ToList();
                    return Ok(valTypesDesc);
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }

        //get data for create report modal
        [HttpGet]
        [Route("api/gmrs/reportmodal")]
        public IHttpActionResult ReportModalD()
        {
            ReportModal rp = new ReportModal();
            using (var db = new GMRSDBEntities())
            {
                try
                {
                    db.Configuration.ProxyCreationEnabled = false;
                    var cats = (from Category in db.Category
                                orderby
                                  Category.CategoryName
                                select new
                                {
                                    CategoryID = Category.CategoryID,
                                    CategoryName = Category.CategoryName
                                }).ToList();
                    var years = (from Data in db.Data
                                  orderby
                                    Data.Year
                                  select new
                                  {
                                      Data.Year
                                  }).Distinct().ToList();
                    var valTypes = (from ValueType in db.ValueType
                                    select new
                                    {
                                        ValueType.ValueTypeName
                                    }).Distinct().ToList();
                    
                    for (int i = 0; i < valTypes.Count; i++)
                    {
                        rp.valueTypes.Add(valTypes[i].ValueTypeName);
                    }
                    for (int i = 0; i < years.Count; i++)
                    {
                        rp.years.Add(years[i].Year);
                    }
                    for (int i = 0; i < cats.Count; i++)
                    {
                        Category c = new Category();
                        c.CategoryID = cats[i].CategoryID;
                        c.CategoryName = cats[i].CategoryName;
                        rp.categories.Add(c);
                    }

                    return Ok(rp);
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }

        //get relevant data for report
        [HttpPost]
        [Route("api/gmrs/relevantdata")]
        public IHttpActionResult RelevantData([FromBody] Report report)
        {
            using (var db = new GMRSDBEntities())
            {
                try
                {
                    db.Configuration.ProxyCreationEnabled = false;
                    switch (report.id)
                    {
                        case 1:
                            var data = (from DataCategory in db.DataCategory
                                        where
                                          DataCategory.Data.Year >= report.startYear && DataCategory.Data.Year <= report.endYear &&
                                          DataCategory.Data.ValueType.ValueTypeName == report.reportType &&
                                          DataCategory.Category.CategoryName == report.category &&
                                          DataCategory.CategoryDesc == report.catDesc
                                        group DataCategory.Data by new
                                        {
                                            DataCategory.Data.Year,
                                            DataCategory.Data.Month
                                        } into g
                                        orderby
                                          g.Key.Year,
                                          g.Key.Month
                                        select new
                                        {
                                            g.Key.Year,
                                            g.Key.Month,
                                            value = (double?)g.Sum(p => p.Value)
                                        }).ToList();
                            return Ok(data);
                        case 2:
                            var data2 = (from DataCategory in db.DataCategory
                                         where
                                           DataCategory.Data.Year == report.year &&
                                           DataCategory.Category.CategoryName == report.category &&
                                           DataCategory.Data.ValueType.ValueTypeName == report.reportType &&
                                           DataCategory.Data.ValueType.ValueTypeDesc == report.typeDesc
                                         select new
                                         {
                                             DataCategory.Data.Month,
                                             DataCategory.CategoryDesc,
                                             DataCategory.Data.Value
                                         }).ToList();
                            return Ok(data2);
                        default:
                            return null;
                    }
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }
    }

    //class Report
    public class Report
    {
        public String category;
        public string catDesc;
        public int startYear;
        public int endYear;
        public string reportType;
        public int year;
        public string typeDesc;
        public int id;
    }

    //class ReportModal
    public class ReportModal
    {
        public List<string> valueTypes { get; set; }
        public List<string> valueTypesDesc { get; set; }
        public List<Category> categories { get; set; }
        public List<int> years { get; set; }

        public ReportModal()
        {
            valueTypes = new List<string>();
            categories = new List<Category>();
            valueTypesDesc = new List<string>();
            years = new List<int>();
        }
    }

}

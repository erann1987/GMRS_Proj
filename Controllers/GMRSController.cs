using GMRS_Proj.Models;
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
        [Route("api/gmrs/data")]
        public IHttpActionResult getData()
        {
            using (var db = new GMRSDBEntities())
            {
                try
                {
                    db.Configuration.ProxyCreationEnabled = false;
                    var data = (from DataCategory in db.DataCategory
                                select new
                                {
                                    DataCategory.Data.Value,
                                    DataCategory.Data.Year,
                                    DataCategory.Data.Month,
                                    DataCategory.Data.ValueType.ValueTypeName,
                                    DataCategory.CategoryDesc
                                }).ToList();
                    return Ok(data);
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }
        [Route("api/gmrs/categories")]
        public IHttpActionResult getCategories()
        {
            IEnumerable<Category> res;

            using (var db = new GMRSDBEntities())
            {
                try
                {
                    db.Configuration.ProxyCreationEnabled = false;
                    res = db.Category.ToList();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }

        [Route("api/gmrs/valuetype")]
        public IHttpActionResult getValueType()
        {
            IEnumerable<GMRS_Proj.Models.ValueType> res;

            using (var db = new GMRSDBEntities())
            {
                try
                {
                    db.Configuration.ProxyCreationEnabled = false;
                    res = db.ValueType.ToList();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }

        [HttpPost]
        [Route("api/gmrs/relevantdata")]
        public IHttpActionResult RelevantData([FromBody] Report report)
        {
            using (var db = new GMRSDBEntities())
            {
                try
                {
                    db.Configuration.ProxyCreationEnabled = false;
                    string d1 = report.reportType[0];

                    var data = (from DataCategory in db.DataCategory
                                where
                                  DataCategory.Data.Year >= report.startYear && DataCategory.Data.Year <= report.endYear &&
                                  DataCategory.Category.CategoryName == report.category &&
                                  DataCategory.Data.ValueType.ValueTypeName == d1
                                group new { DataCategory, DataCategory.Data } by new
                                {
                                    DataCategory.CategoryDesc,
                                    DataCategory.Data.Year
                                } into g
                                select new
                                {
                                    year = g.Key.Year,
                                    y = (double?)g.Sum(p => p.DataCategory.Data.Value),
                                    name = g.Key.CategoryDesc
                                }).ToList();
                    return Ok(data);
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }


    }

    public class Report
    {
        public String category;
        public int startYear;
        public int endYear;
        public string[] reportType;
    }
}

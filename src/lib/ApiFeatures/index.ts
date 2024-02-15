import { db } from "../db";

function convertArrayToObject(obj:Object) {
  return Object.entries(obj).reduce((acc:any, [key, value]) => {
      // اگر مقدار ویژگی یک آرایه است و تعداد عناصر آن برابر با یک است، مقدار اول آن را به عنوان مقدار ویژگی جدید انتخاب کنید.
      if (Array.isArray(value) && value.length === 1) {
          acc[key] = value[0];
      } else {
          acc[key] = value;
      }
      return acc;
  }, {});
}

class APIFeatures {
  query;
  queryString;
  total;
  model;

  constructor(query: any, model: any, queryString: any) {
    this.query = query;
    this.queryString = convertArrayToObject(queryString);
    this.total = 0;
    this.model = model;
  }

  async filter() {
    let queryObj = { ...this.queryString };
    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "keyword",
      "min_price",
      "max_price",
    ];
    excludedFields.forEach((el) => delete queryObj[el]);

    // keyword
    if (this.queryString.keyword) {
      queryObj = {
        ...queryObj,
        OR: [
          { title: { contains: this.queryString.keyword } },
          { description: { contains: this.queryString.keyword } },
        ],
      };
    }

    // price filter
    // if (queryObj.deal_type === "sale") {
    //   if (this.queryString.min_price || this.queryString.max_price) {
    //     queryObj.price = {};
    //     if (this.queryString.min_price) {
    //       queryObj.price.gte = this.queryString.min_price;
    //     }
    //     if (this.queryString.max_price) {
    //       queryObj.price.lte = this.queryString.max_price;
    //     }
    //   }
    // } else if (queryObj.deal_type === "rent") {
    //   if (this.queryString.min_price || this.queryString.max_price) {
    //     queryObj.mortgage_price = {};
    //     if (this.queryString.min_price) {
    //       queryObj.mortgage_price.gte = this.queryString.min_price;
    //     }
    //     if (this.queryString.max_price) {
    //       queryObj.mortgage_price.lte = this.queryString.max_price;
    //     }
    //   }
    // }    
    // 1B) Advanced filtering
    const filterOptions = {
      where: queryObj,
    };

    this.query = await this.query.findMany(filterOptions);
    console.log(queryObj, this.queryString);
    
    // this.total = await this.query.count();

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.findMany({orderBy:sortBy});
    } else {
      this.query = this.query.findMany({orderBy:{ createdAt: "desc" }});
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select({
        select: {},
        include: {},
      });
    } else {
      this.query = this.query.select({});
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).take(limit);

    return this;
  }
}

export default APIFeatures;

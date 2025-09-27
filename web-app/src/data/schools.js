export function getSchoolsStore() {
  const stringifiedSchools = localStorage.getItem('schools-store');
  return stringifiedSchools
    ? JSON.parse(stringifiedSchools)
    : INITIAL_SCHOOLS_STORE;
}

export function setSchoolsStore(schools) {
  return localStorage.setItem('schools-store', JSON.stringify(schools));
}

export async function getMany({ paginationModel, filterModel, sortModel }) {
  const adminsStore = getSchoolsStore();

  let filteredAdmins = [...adminsStore];

  // Apply filters (example only)
  if (filterModel?.items?.length) {
    filterModel.items.forEach(({ field, value, operator }) => {
      if (!field || value == null) {
        return;
      }

      filteredAdmins = filteredAdmins.filter((school) => {
        const adminValue = school[field];

        switch (operator) {
          case 'contains':
            return String(adminValue)
              .toLowerCase()
              .includes(String(value).toLowerCase());
          case 'equals':
            return adminValue === value;
          case 'startsWith':
            return String(adminValue)
              .toLowerCase()
              .startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(adminValue)
              .toLowerCase()
              .endsWith(String(value).toLowerCase());
          case '>':
            return adminValue > value;
          case '<':
            return adminValue < value;
          default:
            return true;
        }
      });
    });
  }

  // Apply sorting
  if (sortModel?.length) {
    filteredAdmins.sort((a, b) => {
      for (const { field, sort } of sortModel) {
        if (a[field] < b[field]) {
          return sort === 'asc' ? -1 : 1;
        }
        if (a[field] > b[field]) {
          return sort === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });
  }

  // Apply pagination
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize;
  const paginatedAdmins = filteredAdmins.slice(start, end);

  return {
    items: paginatedAdmins,
    itemCount: filteredAdmins.length,
  };
}

export async function getOne(adminId) {
  const adminsStore = getSchoolsStore();

  const adminToShow = adminsStore.find(
    (school) => school.id === adminId,
  );

  if (!adminToShow) {
    throw new Error('Admin not found');
  }
  return adminToShow;
}

export async function createOne(data) {
  const adminsStore = getSchoolsStore();

  const newAdmin = {
    id: adminsStore.reduce((max, school) => Math.max(max, school.id), 0) + 1,
    ...data,
  };

  setSchoolsStore([...adminsStore, newAdmin]);

  return newAdmin;
}

export async function updateOne(adminId, data) {
  const adminsStore = getSchoolsStore();

  let updatedAdmin = null;

  setSchoolsStore(
    adminsStore.map((school) => {
      if (school.id === adminId) {
        updatedAdmin = { ...school, ...data };
        return updatedAdmin;
      }
      return school;
    }),
  );

  if (!updatedAdmin) {
    throw new Error('Admin not found');
  }
  return updatedAdmin;
}

export async function deleteOne(adminId) {
  const adminsStore = getSchoolsStore();

  setSchoolsStore(adminsStore.filter((school) => school.id !== adminId));
}


export function validate(school) {
  let issues = [];

  if (!school.name) {
    issues = [...issues, { message: 'Name is required', path: ['name'] }];
  }

  return { issues };
}

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
  const schoolsStore = getSchoolsStore();

  let filteredSchools = [...schoolsStore];

  // Apply filters (example only)
  if (filterModel?.items?.length) {
    filterModel.items.forEach(({ field, value, operator }) => {
      if (!field || value == null) {
        return;
      }

      filteredSchools = filteredSchools.filter((school) => {
        const schoolValue = school[field];

        switch (operator) {
          case 'contains':
            return String(schoolValue)
              .toLowerCase()
              .includes(String(value).toLowerCase());
          case 'equals':
            return schoolValue === value;
          case 'startsWith':
            return String(schoolValue)
              .toLowerCase()
              .startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(schoolValue)
              .toLowerCase()
              .endsWith(String(value).toLowerCase());
          case '>':
            return schoolValue > value;
          case '<':
            return schoolValue < value;
          default:
            return true;
        }
      });
    });
  }

  // Apply sorting
  if (sortModel?.length) {
    filteredSchools.sort((a, b) => {
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
  const paginatedSchools = filteredSchools.slice(start, end);

  return {
    items: paginatedSchools,
    itemCount: filteredSchools.length,
  };
}

export async function getOne(schoolId) {
  const schoolsStore = getSchoolsStore();

  const schoolToShow = schoolsStore.find(
    (school) => school.id === schoolId,
  );

  if (!schoolToShow) {
    throw new Error('School not found');
  }
  return schoolToShow;
}

export async function createOne(data) {
  const schoolsStore = getSchoolsStore();

  const newSchool = {
    id: schoolsStore.reduce((max, school) => Math.max(max, school.id), 0) + 1,
    ...data,
  };

  setSchoolsStore([...schoolsStore, newSchool]);

  return newSchool;
}

export async function updateOne(schoolId, data) {
  const schoolsStore = getSchoolsStore();

  let updatedSchool = null;

  setSchoolsStore(
    schoolsStore.map((school) => {
      if (school.id === schoolId) {
        updatedSchool = { ...school, ...data };
        return updatedSchool;
      }
      return school;
    }),
  );

  if (!updatedSchool) {
    throw new Error('School not found');
  }
  return updatedSchool;
}

export async function deleteOne(schoolId) {
  const schoolsStore = getSchoolsStore();
  setSchoolsStore(schoolsStore.filter((school) => school.id !== schoolId));
}


export function validate(school) {
  let issues = [];

  if (!school.name) {
    issues = [...issues, { message: 'Name is required', path: ['name'] }];
  }

  return { issues };
}

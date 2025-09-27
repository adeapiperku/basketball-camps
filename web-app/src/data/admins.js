export function getAdminsStore() {
  const stringifiedAdmins = localStorage.getItem('admins-store');
  return stringifiedAdmins
    ? JSON.parse(stringifiedAdmins)
    : INITIAL_ADMINS_STORE;
}

export function setAdminsStore(admins) {
  return localStorage.setItem('admins-store', JSON.stringify(admins));
}

export async function getMany({ paginationModel, filterModel, sortModel }) {
  const adminsStore = getAdminsStore();

  let filteredAdmins = [...adminsStore];

  // Apply filters (example only)
  if (filterModel?.items?.length) {
    filterModel.items.forEach(({ field, value, operator }) => {
      if (!field || value == null) {
        return;
      }

      filteredAdmins = filteredAdmins.filter((admin) => {
        const adminValue = admin[field];

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
  const adminsStore = getAdminsStore();

  const adminToShow = adminsStore.find(
    (admin) => admin.id === adminId,
  );

  if (!adminToShow) {
    throw new Error('Admin not found');
  }
  return adminToShow;
}

export async function createOne(data) {
  const adminsStore = getAdminsStore();

  const newAdmin = {
    id: adminsStore.reduce((max, admin) => Math.max(max, admin.id), 0) + 1,
    ...data,
  };

  setAdminsStore([...adminsStore, newAdmin]);

  return newAdmin;
}

export async function updateOne(adminId, data) {
  const adminsStore = getAdminsStore();

  let updatedAdmin = null;

  setAdminsStore(
    adminsStore.map((admin) => {
      if (admin.id === adminId) {
        updatedAdmin = { ...admin, ...data };
        return updatedAdmin;
      }
      return admin;
    }),
  );

  if (!updatedAdmin) {
    throw new Error('Admin not found');
  }
  return updatedAdmin;
}

export async function deleteOne(adminId) {
  const adminsStore = getAdminsStore();

  setAdminsStore(adminsStore.filter((admin) => admin.id !== adminId));
}


export function validate(admin) {
  let issues = [];

  if (!admin.firstName) {
    issues = [...issues, { message: 'First Name is required', path: ['firstName'] }];
  }

  if (!admin.lastName) {
    issues = [...issues, { message: 'Last Name is required', path: ['lastName'] }];
  }

  if (!admin.birthDate) {
    issues = [...issues, { message: 'Birth date is required', path: ['birthDate'] }];
  }

  if (!admin.email) {
    issues = [...issues, { message: 'Email is required', path: ['email'] }];
  }

  if (!admin.phoneNumber) {
    issues = [...issues, { message: 'Phone number is required', path: ['phoneNumber'] }];
  }

  if (!admin.password) {
    issues = [...issues, { message: 'Password is required', path: ['password'] }];
  }

  return { issues };
}

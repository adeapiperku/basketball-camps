export function getCoachesStore() {
  const stringifiedCoaches = localStorage.getItem('coaches-store');
  return stringifiedCoaches
    ? JSON.parse(stringifiedCoaches)
    : INITIAL_COACHES_STORE;
}

export function setCoachesStore(coaches) {
  return localStorage.setItem('coaches-store', JSON.stringify(coaches));
}

export async function getMany({ paginationModel, filterModel, sortModel }) {
  const coachesStore = getCoachesStore();

  let filteredCoaches = [...coachesStore];

  // Apply filters (example only)
  if (filterModel?.items?.length) {
    filterModel.items.forEach(({ field, value, operator }) => {
      if (!field || value == null) {
        return;
      }

      filteredCoaches = filteredCoaches.filter((coach) => {
        const coachValue = coach[field];

        switch (operator) {
          case 'contains':
            return String(coachValue)
              .toLowerCase()
              .includes(String(value).toLowerCase());
          case 'equals':
            return coachValue === value;
          case 'startsWith':
            return String(coachValue)
              .toLowerCase()
              .startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(coachValue)
              .toLowerCase()
              .endsWith(String(value).toLowerCase());
          case '>':
            return coachValue > value;
          case '<':
            return coachValue < value;
          default:
            return true;
        }
      });
    });
  }

  // Apply sorting
  if (sortModel?.length) {
    filteredCoaches.sort((a, b) => {
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
  const paginatedCoaches = filteredCoaches.slice(start, end);

  return {
    items: paginatedCoaches,
    itemCount: filteredCoaches.length,
  };
}

export async function getOne(coachId) {
  const coachesStore = getCoachesStore();

  const coachToShow = coachesStore.find(
    (coach) => coach.id === coachId,
  );

  if (!coachToShow) {
    throw new Error('Coach not found');
  }
  return coachToShow;
}

export async function createOne(data) {
  const coachesStore = getCoachesStore();

  const newCoach = {
    id: coachesStore.reduce((max, coach) => Math.max(max, coach.id), 0) + 1,
    ...data,
  };

  setCoachesStore([...coachesStore, newCoach]);

  return newCoach;
}

export async function updateOne(coachId, data) {
  const coachesStore = getCoachesStore();

  let updatedCoach = null;

  setCoachesStore(
    coachesStore.map((coach) => {
      if (coach.id === coachId) {
        updatedCoach = { ...coach, ...data };
        return updatedCoach;
      }
      return coach;
    }),
  );

  if (!updatedCoach) {
    throw new Error('Coach not found');
  }
  return updatedCoach;
}

export async function deleteOne(coachId) {
  const coachesStore = getCoachesStore();

  setCoachesStore(coachesStore.filter((coach) => coach.id !== coachId));
}


export function validate(coach) {
  let issues = [];

  if (!coach.firstName) {
    issues = [...issues, { message: 'First Name is required', path: ['firstName'] }];
  }

  if (!coach.lastName) {
    issues = [...issues, { message: 'Last Name is required', path: ['lastName'] }];
  }

  if (!coach.birthDate) {
    issues = [...issues, { message: 'Birth date is required', path: ['birthDate'] }];
  }

  if (!coach.email) {
    issues = [...issues, { message: 'Email is required', path: ['email'] }];
  }

  if (!coach.phoneNumber) {
    issues = [...issues, { message: 'Phone number is required', path: ['phoneNumber'] }];
  }

  if (!coach.type) {
    issues = [...issues, { message: 'Type is required', path: ['type'] }];
  }

  if (!coach.password) {
    issues = [...issues, { message: 'Password is required', path: ['password'] }];
  }

  return { issues };
}

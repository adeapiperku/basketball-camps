const INITIAL_CAMPS_STORE = [];

export function getCampsStore() {
    const stringifiedCamps = localStorage.getItem('camps-store');
    return stringifiedCamps
      ? JSON.parse(stringifiedCamps)
      : INITIAL_CAMPS_STORE;
  }
  
  export function setCampsStore(camps) {
    return localStorage.setItem('camps-store', JSON.stringify(camps));
  }
  
  export async function getMany({ paginationModel, filterModel, sortModel }) {
    const campsStore = getCampsStore();
  
    let filteredCamps = [...campsStore];
  
    // Apply filters (example only)
    if (filterModel?.items?.length) {
      filterModel.items.forEach(({ field, value, operator }) => {
        if (!field || value == null) {
          return;
        }
  
        filteredCamps = filteredCamps.filter((camp) => {
          const campValue = camp[field];
  
          switch (operator) {
            case 'contains':
              return String(campValue)
                .toLowerCase()
                .includes(String(value).toLowerCase());
            case 'equals':
              return campValue === value;
            case 'startsWith':
              return String(campValue)
                .toLowerCase()
                .startsWith(String(value).toLowerCase());
            case 'endsWith':
              return String(campValue)
                .toLowerCase()
                .endsWith(String(value).toLowerCase());
            case '>':
              return campValue > value;
            case '<':
              return campValue < value;
            default:
              return true;
          }
        });
      });
    }
  
    // Apply sorting
    if (sortModel?.length) {
      filteredCamps.sort((a, b) => {
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
    const paginatedCamps = filteredCamps.slice(start, end);
  
    return {
      items: paginatedCamps,
      itemCount: filteredCamps.length,
    };
  }
  
  export async function getOne(campId) {
    const campsStore = getCampsStore();

    const campToShow = campsStore.find((camp) => camp.id === campId);

    if (!campToShow) {
      throw new Error('Camp not found');
    }
    return campToShow;
  }

  export async function createOne(data) {
    const campsStore = getCampsStore();

    const newCamp = {
      id: campsStore.reduce((max, camp) => Math.max(max, camp.id), 0) + 1,
      ...data,
    };

    setCampsStore([...campsStore, newCamp]);

    return newCamp;
  }

  export async function updateOne(campId, data) {
    const campsStore = getCampsStore();

    let updatedCamp = null;

    setCampsStore(
      campsStore.map((camp) => {
        if (camp.id === campId) {
          updatedCamp = { ...camp, ...data };
          return updatedCamp;
        }
        return camp;
      }),
    );

    if (!updatedCamp) {
      throw new Error('Camp not found');
    }
    return updatedCamp;
  }

  export async function deleteOne(campId) {
    const campsStore = getCampsStore();
    setCampsStore(campsStore.filter((camp) => camp.id !== campId));
  }

  export function validate(camp) {
    let issues = [];

    if (!camp.name) {
      issues = [...issues, { message: 'Name is required', path: ['name'] }];
    }

    if (!camp.description) {
      issues = [...issues, { message: 'Description is required', path: ['description'] }];
    }

    if (!camp.location) {
      issues = [...issues, { message: 'Location is required', path: ['location'] }];
    }

    if (!camp.startDate) {
      issues = [...issues, { message: 'Start date is required', path: ['startDate'] }];
    }

    if (!camp.endDate) {
      issues = [...issues, { message: 'End date is required', path: ['endDate'] }];
    }

    if (!camp.registrationDeadline) {
      issues = [...issues, { message: 'Registration deadline is required', path: ['registrationDeadline'] }];
    }

    if (camp.price == null || Number(camp.price) <= 0) {
      issues = [...issues, { message: 'Price must be greater than 0', path: ['price'] }];
    }

    if (camp.maxParticipants == null || Number(camp.maxParticipants) <= 0) {
      issues = [...issues, { message: 'Max participants must be greater than 0', path: ['maxParticipants'] }];
    }

    return { issues };
  }
class GetApplyEndDateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GetApplyEndDateError";
  }
}

class GetApplyStartDateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GetApplyStartDateError";
  }
}

class GetJobDescriptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GetJobDescriptionError";
  }
}

class GetCompanyNameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GetCompanyNameError";
  }
}
class GetTitleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GetTitleError";
  }
}

class GetRegionTextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GetRegionTextError";
  }
}

class GetJobTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GetJobTypeError";
  }
}

class GetRequireExperienceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GetRequireExperienceError";
  }
}

class GetDepartmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GetDepartmentError";
  }
}

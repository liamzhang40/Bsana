import React from 'react';
import { withRouter } from 'react-router-dom';

class SessionForm extends React.Component {
  constructor(props) {
    super(props);
    if (props.formType === 'Sign up') {
      this.state = {
        name: '',
        username: '',
        password: '',
        avatarURL: '',
        avatarFile: null
      };
    } else {
      this.state = {
        username: '',
        password: ''
      };
    }

    this.handleSumbit = this.handleSumbit.bind(this);
  }

  update(field) {
    return e => {
      if (field === 'avatar') {
        const reader = new FileReader();
        const file = e.currentTarget.files[0];
        reader.onloadend = () =>
          this.setState({ avatarURL: reader.result, avatarFile: file});

        if (file) {
          reader.readAsDataURL(file);
        } else {
          this.setState({ avatarURL: '', avatarFile: null });
        }
      } else {
        this.setState({[field]: e.currentTarget.value});
      }
    };
  }

  handleSumbit(e) {
    e.preventDefault();
    const {
      history,
      formType,
      openModal,
      closeModal,
      fetchTeams,
      processForm
    } = this.props;

    const file = this.state.avatarFile;

    const formData = new FormData();
    formData.append('user[name]', this.state.name);
    formData.append('user[username]', this.state.username);
    formData.append('user[password]', this.state.password);
    if (file) formData.append('user[avatar]', file);

    processForm(formData, this.resetForm).then((res) => {
      if (formType === 'Sign up') {
        openModal('createteam');
      } else {
        // redirect should wait utill all sample state is ready to render
        // all the components in the next url page!!!
        fetchTeams().then(() => {
          const teamId = res.user.teamIds[0];
          history.push(`/dashboard/teams/${teamId}`);
        });
        closeModal();
      }}
    );
  }

  render() {
    const {
      text,
      errors,
      formType,
      otherType,
      openModal
    } = this.props;

    let nameInput = '';
    let fileInput = '';
    if (formType === 'Sign up') {
      nameInput = (
        <div>
          <img src={this.state.avatarURL} alt='Your Profile'/>
          <label htmlFor='name-input'>Name</label>
          <input
            id='name-input'
            placeholder='Liam'
            type='text'
            onChange={this.update('name')} />
        </div>
      );

      fileInput = (
        <input
          className='avatar-upload'
          type='file'
          onChange={this.update('avatar')}/>
      );
    }

    return (
      <div className='session-form'>
        <h1>{formType}</h1>
        {fileInput}

        <form onSubmit={this.handleSumbit}>
          {nameInput}
          <div>
            <label htmlFor='email-input'>Email Address</label>
            <input
              id='email-input'
              placeholder='name@company.com'
              type='text'
              onChange={this.update('username')} />
          </div>

          <div>
            <label htmlFor='password-input'>Password</label>
            <input
              id='password-input'
              placeholder='Password'
              type='password'
              onChange={this.update('password')} />
          </div>

          <input className='session-button' type='submit' value={`${formType}`}/>
        </form>

        <ul>
          {errors.map((error, idx) => <li>{error}</li>)}
        </ul>

        {text}
        <button onClick={() => openModal()}>{otherType}</button>
      </div>
    );
  }
}

export default withRouter(SessionForm);
